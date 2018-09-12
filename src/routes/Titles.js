import React from 'react';
import PropTypes from 'prop-types';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';

import ViewTitle from '../components/ViewTitle';
import packageInfo from '../../package.json';

const INITIAL_RESULT_COUNT = 20;

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
      path: 'erm/titles',
      // recordsRequired: '%{resultCount}',
      // perRequest: 1,
      // offsetParam: 'page',
      GET: {
        params: {
          match: 'title',
          term: '%{query.query}',
          perPage: '50',
        },
      },
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
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
          columnMapping={{
            id: 'ID',
            title: 'Title',
          }}
          columnWidths={{
            id: 150,
            title: 'auto',
          }}
        />
      </React.Fragment>
    );
  }
}
