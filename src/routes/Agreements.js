import React from 'react';
import PropTypes from 'prop-types';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';

import ViewAgreement from '../components/ViewAgreement';
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

const MATCH = [
  'name',
  'description',
  'localReference',
  'vendorReference',
].map(t => `match=${t}`).join('&');

export default class Agreements extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      path: (queryParams, pathComponents, resources) => {
        let path = 'erm/sas';
        let params = [];

        const { query: { query, filters, sort } } = resources;

        if (query) params.push(`${MATCH}&term=${query}`);

        return `${path}?${params.join('&')}`;
      },
    },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: '',
      },
    },
    resultCount: {
      initialValue: INITIAL_RESULT_COUNT
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  };

  componentWillUnmount() {
    console.log('Agreements willUnmount')
  }

  render() {
    const path = '/erm/agreements';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="agreements"
          packageInfo={packageInfo}
          filterConfig={[]}
          objectName="title"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewAgreement}
          editRecordComponent={EditRecord}
          visibleColumns={['id', 'name', 'description']}
          viewRecordPerms="module.erm.enabled"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          columnMapping={{
            id: 'ID',
            title: 'Title',
            description: 'Description'
          }}
        />
      </React.Fragment>
    );
  }
}
