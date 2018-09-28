import React from 'react';
import PropTypes from 'prop-types';

import { SearchAndSort } from '@folio/stripes-smart-components';

import ViewTitle from '../components/Titles/ViewTitle';
import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

const EditRecord = (props) => (
  <div>
    <h3>Edit Record</h3>
    <pre>
      {JSON.stringify(props)}
    </pre>
  </div>
);

export default class Titles extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      resourceShouldRefresh: true,
      records: 'results',
      path: 'erm/titles',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      params: getSASParams({
        searchKey: 'title'
      }),
    },
    query: {
      initialValue: {
        query: '',
        filters: '',
      }
    },
    resultCount: {
      initialValue: INITIAL_RESULT_COUNT,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      resultCount: PropTypes.number,
    }),
    mutator: PropTypes.shape({
      resultCount: PropTypes.object,
    }),
  };

  render() {
    const path = '/erm/titles';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="titles"
          packageInfo={packageInfo}
          filterConfig={[]}
          objectName="title"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewTitle}
          editRecordComponent={EditRecord}
          visibleColumns={['id', 'title']}
          viewRecordPerms="module.erm.enabled"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult
          columnMapping={{
            id: 'ID',
            title: 'Title',
          }}
          columnWidths={{
            id: 300,
            title: 'auto',
          }}
        />
      </React.Fragment>
    );
  }
}
