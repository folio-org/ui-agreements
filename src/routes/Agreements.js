import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import { SearchAndSort } from '@folio/stripes/smart-components';
import { getSASParams } from '@folio/stripes-erm-components';

import ViewAgreement from '../components/Agreements/ViewAgreement';
import EditAgreement from '../components/Agreements/EditAgreement';
import AgreementFilters from '../components/Agreements/AgreementFilters';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;
const DEFAULT_FILTERS = 'agreementStatus.Requested,agreementStatus.In Negotiation,agreementStatus.Draft,agreementStatus.Active';
const DEFAULT_SORT = 'Name';

class Agreements extends React.Component {
  static manifest = Object.freeze({
    agreements: {
      type: 'okapi',
      path: 'erm/sas',
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'Name': 'name',
          'Vendor': 'vendor',
          'Start date': 'startDate',
          'End date': 'endDate',
          'Cancellation deadline': 'cancellationDeadline',
          'Status': 'agreementStatus',
          'Last updated': 'lastUpdated',
        },
        filterKeys: {
          orgs: 'orgs.org',
          role: 'orgs.role',
        },
      }),
    },
    selectedAgreement: {
      type: 'okapi',
      path: 'erm/sas/${selectedAgreementId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    },
    agreementTypeValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementType',
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementStatus',
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/renewalPriority',
    },
    isPerpetualValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/isPerpetual',
    },
    contentReviewNeededValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/contentReviewNeeded',
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreementOrg/role',
    },
    contactRoleValues: {
      type: 'okapi',
      path: 'erm/refdataValues/InternalContact/role',
    },
    licenseLinkStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/RemoteLicenseLink/status',
    },
    basket: { initialValue: [] },
    query: {
      initialValue: {
        filters: DEFAULT_FILTERS,
        sort: DEFAULT_SORT,
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    selectedAgreementId: { initialValue: '' },
  });

  static propTypes = {
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    intl: intlShape,
    resources: PropTypes.object,
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func,
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = {
    showSingleResult: true,
  }

  handleCreate = (agreement) => {
    const { mutator } = this.props;

    return mutator.agreements.POST(agreement)
      .then((newAgreement) => {
        mutator.query.update({
          _path: `/erm/agreements/view/${newAgreement.id}`,
          layer: '',
        });
      });
  }

  handleFilterChange = ({ name, values }) => {
    const newFilters = {
      ...this.getActiveFilters(),
      [name]: values,
    };

    const filters = Object.keys(newFilters)
      .map((filterName) => {
        return newFilters[filterName]
          .map((filterValue) => `${filterName}.${filterValue}`)
          .join(',');
      })
      .filter(filter => filter)
      .join(',');

    this.props.mutator.query.update({ filters });
  }

  handleUpdate = (agreement) => {
    this.props.mutator.selectedAgreementId.replace(agreement.id);

    return this.props.mutator.selectedAgreement.PUT(agreement);
  }

  getActiveFilters = () => {
    const { query } = this.props.resources;

    if (!query || !query.filters) return {};

    return query.filters
      .split(',')
      .reduce((filterMap, currentFilter) => {
        const [name, value] = currentFilter.split('.');

        if (!Array.isArray(filterMap[name])) {
          filterMap[name] = [];
        }

        filterMap[name].push(value);
        return filterMap;
      }, {});
  }

  getPackageInfo = () => {
    return {
      ...packageInfo,
      stripes: {
        ...packageInfo.stripes,
        route: '/erm/agreements',
        path: `/erm/agreements?sort=${DEFAULT_SORT}&filters=${DEFAULT_FILTERS}`,
      },
    };
  }

  renderFilters = (onChange) => {
    return (
      <AgreementFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
        resources={this.props.resources}
      />
    );
  }

  render() {
    const { mutator, resources, intl } = this.props;

    return (
      <React.Fragment>
        <SearchAndSort
          browseOnly={this.props.browseOnly}
          columnMapping={{
            name: intl.formatMessage({ id: 'ui-agreements.agreements.name' }),
            vendor: intl.formatMessage({ id: 'ui-agreements.agreements.vendorInfo.vendor' }),
            startDate: intl.formatMessage({ id: 'ui-agreements.agreements.startDate' }),
            endDate: intl.formatMessage({ id: 'ui-agreements.agreements.endDate' }),
            cancellationDeadline: intl.formatMessage({ id: 'ui-agreements.agreements.cancellationDeadline' }),
            agreementStatus: intl.formatMessage({ id: 'ui-agreements.agreements.agreementStatus' }),
            lastUpdated: intl.formatMessage({ id: 'ui-agreements.lastUpdated' }),
          }}
          columnWidths={{
            name: 300,
            vendor: 200,
            startDate: 120,
            endDate: 120,
            cancellationDeadline: 120,
            agreementStatus: 150,
            lastUpdated: 120,
          }}
          detailProps={{
            onUpdate: this.handleUpdate
          }}
          disableRecordCreation={this.props.disableRecordCreation}
          editRecordComponent={EditAgreement}
          initialResultCount={INITIAL_RESULT_COUNT}
          key="agreements"
          newRecordPerms="ui-agreements.agreements.create"
          objectName="agreement"
          onCreate={this.handleCreate}
          onFilterChange={this.handleFilterChange}
          onSelectRow={this.props.onSelectRow}
          packageInfo={this.getPackageInfo()}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          showSingleResult={this.props.showSingleResult}
          viewRecordComponent={ViewAgreement}
          viewRecordPerms="ui-agreements.agreements.view"
          // SearchAndSort expects the resource it's going to list to be under the `records` key.
          // However, if we just put it under `records` in the `manifest`, it would clash with
          // the `records` that would need to be defined by the Agreements tab.
          parentMutator={{
            ...mutator,
            records: mutator.agreements,
          }}
          parentResources={{
            ...resources,
            records: resources.agreements,
          }}
          renderFilters={this.renderFilters}
          resultsFormatter={{
            vendor: a => a.vendor && a.vendor.name,
            startDate: a => a.startDate && intl.formatDate(a.startDate),
            endDate: a => a.endDate && intl.formatDate(a.endDate),
            cancellationDeadline: a => a.cancellationDeadline && intl.formatDate(a.cancellationDeadline),
            agreementStatus: a => a.agreementStatus && a.agreementStatus.label,
          }}
          visibleColumns={[
            'name',
            'vendor',
            'startDate',
            'endDate',
            'cancellationDeadline',
            'agreementStatus',
            'lastUpdated'
          ]}
        />
      </React.Fragment>
    );
  }
}

export default injectIntl(Agreements);
