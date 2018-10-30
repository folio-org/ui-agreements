import React from 'react';
import PropTypes from 'prop-types';

import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewEResource from '../components/EResources/ViewEResource';
import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

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
        }
      }),
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    resources: PropTypes.shape({
      eresources: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
    }),
    mutator: PropTypes.object,
    stripes: PropTypes.object,
  };

  render() {
    const { mutator, resources, stripes: { intl } } = this.props;
    const path = '/erm/eresources';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="eresources"
          packageInfo={packageInfo}
          filterConfig={[]}
          objectName="name"
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
            name: intl.formatMessage({ id: 'ui-erm.eresources.name' }),
            type: intl.formatMessage({ id: 'ui-erm.eresources.type' }),
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

export default EResources;
