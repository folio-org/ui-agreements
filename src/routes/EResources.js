import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewEResource from '../components/EResources/ViewEResource';
import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

// `label` and `values` will be filled in by `updateFilterConfig`
// `cql` is defined to mute PropType checks by SAS and FilterGroups
const filterConfig = [
  { name: 'type', label: '', cql: '', values: [] },
  {
    name: 'class',
    label: '',
    cql: '',
    values: [
      { name: 'Yes', cql: 'org.olf.kb.Pkg' },
      { name: 'No', cql: 'org.olf.kb.TitleInstance' },
    ],
  },
];

class EResources extends React.Component {
  static manifest = Object.freeze({
    eresources: {
      type: 'okapi',
      path: 'erm/resource/electronic',
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'Name': 'name',
          'Type': 'type',
        },
        filterConfig,
      }),
    },
    typeValues: {
      type: 'okapi',
      path: 'erm/refdataValues/TitleInstance/type',
      perRequest: 100,
      limitParam: 'perPage',
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    eresourceFiltersInitialized: { initialValue: false },
  });

  static propTypes = {
    intl: intlShape,
    resources: PropTypes.shape({
      eresources: PropTypes.object,
      eresourceFiltersInitialized: PropTypes.bool,
      typeValues: PropTypes.object,
    }),
    mutator: PropTypes.object,
  };

  componentDidUpdate() {
    if (!this.props.resources.eresourceFiltersInitialized) {
      this.updateFilterConfig();
    }
  }

  updateFilterConfig() {
    // Define the list of filters we support and are fetching values for.
    const filters = ['type'];

    // Get the records for those filters
    const records = filters
      .map(filter => `${filter}Values`)
      .map(name => get(this.props.resources[name], ['records'], []));

    // If we've fetched the records for every filter...
    if (records.every(record => record.length)) {
      const { intl } = this.props;
      // ...then for every filter...
      filters.forEach((filter, i) => {
        // ...set the filter's `values` and `label` properties
        const config = filterConfig.find(c => c.name === filter);
        config.values = records[i].map(r => ({ name: r.label, cql: '' }));
        config.label = intl.formatMessage({ id: `ui-agreements.eresources.${filter}` });
      });

      // Now we translate any filters that we didn't need to fetch values for.
      const packageFilter = filterConfig.find(f => f.name === 'class');
      packageFilter.label = intl.formatMessage({ id: 'ui-agreements.eresources.isPackage' });
      packageFilter.values[0].name = intl.formatMessage({ id: 'ui-agreements.yes' });
      packageFilter.values[1].name = intl.formatMessage({ id: 'ui-agreements.no' });

      this.props.mutator.eresourceFiltersInitialized.replace(true);
    }
  }

  render() {
    const { mutator, resources, intl } = this.props;
    const path = '/erm/eresources';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="eresources"
          packageInfo={packageInfo}
          filterConfig={filterConfig}
          objectName="eresource"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewEResource}
          viewRecordPerms="module.erm.enabled"
          // SearchAndSort expects the resource it's going to list to be under the `records` key.
          // However, if we just put it under `records` in the `manifest`, it would clash with
          // the `records` that would need to be defined by the Agreements tab.
          parentResources={{
            ...resources,
            records: resources.eresources,
          }}
          parentMutator={{
            ...mutator,
            records: mutator.eresources,
          }}
          showSingleResult
          visibleColumns={[
            'name',
            'type',
          ]}
          columnMapping={{
            name: intl.formatMessage({ id: 'ui-agreements.eresources.name' }),
            type: intl.formatMessage({ id: 'ui-agreements.eresources.type' }),
          }}
          columnWidths={{
            name: 500,
            type: 200,
          }}
          resultsFormatter={{
            type: a => a.type && a.type.label,
          }}
        />
      </React.Fragment>
    );
  }
}

export default injectIntl(EResources);
