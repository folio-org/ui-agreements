import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { checkScope, collapseAllSections, expandAllSections, Tags } from '@folio/stripes-erm-components';

import View from '../components/views/EResource';
import { parseMclSettings, urls, withSuppressFromDiscovery } from '../components/utilities';
import { resultCount, resourceClasses } from '../constants';

const RECORDS_PER_REQUEST = 100;

class EResourceViewRoute extends React.Component {
  static manifest = Object.freeze({
    eresource: {
      type: 'okapi',
      path: 'erm/resource/:{id}',
    },
    entitlementOptions: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlementOptions',
      params: (_q, _p, _r, _l, props) => {
        const entitlementOptionsInitialLoad = parseMclSettings(props.resources.settings, 'initialLoad', 'entitlementOptions');
        return ({
          stats: 'true',
          perPage: entitlementOptionsInitialLoad
        });
      },
      // perRequest: RECORDS_PER_REQUEST,
      records: 'results',
      // limitParam: 'perPage',
      throwErrors: false,
    },
    entitlements: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlements',
      records: 'results',
      // perRequest: RECORDS_PER_REQUEST,
      recordsRequired: '%{entitlementsCount}',
      // limitParam: 'perPage',
      params: (_q, _p, _r, _l, props) => {
        const entitlementsInitialLoad = parseMclSettings(props.resources.settings, 'initialLoad', 'entitlements');
        return ({
          stats: 'true',
          perPage: entitlementsInitialLoad
        });
      },
      /* params: {
        stats: 'true',
      }, */
    },
    relatedEntitlements: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlements/related',
      perRequest: RECORDS_PER_REQUEST,
      recordsRequired: '%{entitlementsCount}',
      limitParam: 'perPage',
      throwErrors: false,
    },
    settings: {
      type: 'okapi',
      path: 'configurations/entries?query=(module=AGREEMENTS and configName=general)',
      records: 'configs',
    },
    packageContents: {
      type: 'okapi',
      path: 'erm/packages/:{id}/content/%{packageContentsFilter}',
      records: 'results',
      limitParam: 'perPage',
      resultOffset: (_q, _p, _r, _l, props) => {
        const { match, resources } = props;
        const resultOffset = get(resources, 'packageContentsConfig.packageContentsOffset');
        const eresourceId = get(resources, 'eresource.records[0].id');
        // console.log(resultOffset, eresourceId !== match.params.id, 'resultoffset');
        return eresourceId !== match.params.id ? 0 : resultOffset;
      },
      params: (_q, p, _r, _l, props) => {
        return ({
          filters: `pkg.id==${p.id}`,
          sort: 'pti.titleInstance.name;asc',
          stats: 'true',
          perPage: props.resources.packageContentsConfig.packageContentsPageSize,
        });
      },
    },
    query: {},
    entitlementsCount: { initialValue: resultCount.INITIAL_RESULT_COUNT },
    packageContentsFilter: { initialValue: 'current' },
    packageContentsConfig: {
      initialValue: {
        packageContentsOffset:  0,
        packageContentsPageSize: 1, // parseMclSettings(props.resources.settings, 'initialLoad', 'packageContents')
      }
    }
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired,
    mutator: PropTypes.shape({
      entitlementsCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      packageContentsCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      packageContentsConfig: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      packageContentsFilter: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      entitlementsCount: PropTypes.number,
      eresource: PropTypes.object,
      packageContents: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      packageContentsFilter: PropTypes.string,
      packageContentsCount: PropTypes.number,
      query: PropTypes.object,
      settings: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    handlers: { },
  }

  componentDidUpdate() {
    const { mutator, resources } = this.props;
    const totalEntitlements = get(resources, 'entitlements.other.totalRecords', RECORDS_PER_REQUEST);
    const { entitlementsCount } = resources;

    if (totalEntitlements > entitlementsCount) {
      mutator.entitlementsCount.replace(totalEntitlements);
    }
  }

  getHelperApp = (eresource = {}) => {
    const { match, resources } = this.props;
    const helper = resources.query.helper;
    if (!helper) return null;

    let HelperComponent = null;

    if (helper === 'tags') HelperComponent = Tags;

    if (!HelperComponent) return null;

    let resource;
    if (eresource.class === resourceClasses.TITLEINSTANCE) {
      resource = 'titles';
    } else if (eresource.class === resourceClasses.PCI) {
      resource = 'pci';
    }

    return (
      <HelperComponent
        link={`erm/${resource}/${match.params.id}`}
        onToggle={() => this.handleToggleHelper(helper)}
      />
    );
  }

  handleClose = () => {
    this.props.history.push(`${urls.eresources()}${this.props.location.search}`);
  }

  handleEdit = () => {
    const { history, location, match } = this.props;
    history.push(`${urls.eresourceEdit(match.params.id)}${location.search}`);
  }

  handleEResourceClick = (id) => {
    this.props.history.push(`${urls.eresourceView(id)}${this.props.location.search}`);
  }

  handleFilterPackageContents = (path) => {
    const { mutator } = this.props;
    mutator.packageContentsFilter.replace(path);
    mutator.packageContentsConfig.replace({ packageContentsOffset: 0 });
  }

  handleNeedMorePackageContents = (_askAmount, index) => {
    const { mutator } = this.props;
    mutator.packageContentsConfig.replace({ packageContentsOffset: index, packageContentsPageSize: 2 }); // parseMclSettings(props.resources.settings, 'pageSize', 'packageContents')
  }

  handleToggleHelper = (helper) => {
    const { mutator, resources } = this.props;
    const currentHelper = resources.query.helper;
    const nextHelper = currentHelper !== helper ? helper : null;

    mutator.query.update({ helper: nextHelper });
  }

  handleToggleTags = () => {
    this.handleToggleHelper('tags');
  }

  isLoading = () => {
    const { match, resources } = this.props;
    return (
      match.params.id !== get(resources, 'eresource.records[0].id') &&
      get(resources, 'eresource.isPending', true)
    );
  }

  getPackageContentsRecordsCount() {
    return this.getPackageContentsRecords()
      ?
      get(this.props.resources, 'packageContents.other.totalRecords', 0)
      :
      0;
  }

  getPackageContentsRecords = () => {
    const { resources, match } = this.props;
    const packageContentsUrl = get(resources, 'packageContents.url', '');

    // If a new eresource is selected or if the filter has changed return undefined
    return (packageContentsUrl.indexOf(`${match.params.id}`) === -1 ||
      packageContentsUrl.indexOf(`content/${resources.packageContentsFilter}`) === -1)
      ?
      undefined
      :
      resources?.packageContents?.records;
  }

  getRecords = (resource) => {
    return get(this.props.resources, `${resource}.isPending`, true)
      ?
      undefined
      :
      get(this.props.resources, `${resource}.records`);
  }

  render() {
    const {
      handlers,
      isSuppressFromDiscoveryEnabled,
      resources,
      tagsEnabled,
    } = this.props;

    return (
      <View
        key={get(resources, 'eresource.loadedAt', 'loading')}
        data={{
          eresource: resources?.eresource?.records?.[0] ?? {},
          entitlementOptions: this.getRecords('entitlementOptions'),
          entitlements: this.getRecords('entitlements'),
          packageContentsFilter: this.props.resources.packageContentsFilter,
          packageContents: this.getPackageContentsRecords(),
          packageContentsCount: this.getPackageContentsRecordsCount(),
          relatedEntitlements: this.getRecords('relatedEntitlements'),
          searchString: this.props.location.search,
        }}
        handlers={{
          ...handlers,
          checkScope,
          collapseAllSections,
          expandAllSections,
          isSuppressFromDiscoveryEnabled,
          onFilterPackageContents: this.handleFilterPackageContents,
          onNeedMorePackageContents: this.handleNeedMorePackageContents,
          onClose: this.handleClose,
          onEdit: this.handleEdit,
          onEResourceClick: this.handleEResourceClick,
          onToggleTags: tagsEnabled ? this.handleToggleTags : undefined,
        }}
        helperApp={(eresource) => this.getHelperApp(eresource)}
        isLoading={this.isLoading()}
      />
    );
  }
}

export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
  withTags,
)(EResourceViewRoute);
