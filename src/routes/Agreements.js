import React from 'react';
import PropTypes from 'prop-types';

import { SearchAndSort } from '@folio/stripes-smart-components';

import ViewAgreement from '../components/Agreements/ViewAgreement';
import EditAgreement from '../components/Agreements/EditAgreement';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

class Agreements extends React.Component {
  static manifest = Object.freeze({
    records: {
      type: 'okapi',
      resourceShouldRefresh: true,
      records: 'results',
      path: (queryParams, pathComponents, resources) => {
        const path = 'erm/sas';
        const params = ['stats=true'];

        const { query: { query, filters, sort } } = resources;

        if (query) params.push(`match=name&match=description&term=${query}`);

        if (params.length) return `${path}?${params.join('&')}`;

        return path;
      },
    },
    query: {},
    resultCount: {},
  });

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
    }),
    mutator: PropTypes.object,
  };

  create = (agreement) => {
    const { mutator } = this.props;

    mutator.records.POST(agreement)
      .then((newAgreement) => {
        mutator.query.update({
          _path: `/erm/agreements/view/${newAgreement.id}`,
          layer: '',
        });
      });
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
          editRecordComponent={EditAgreement}
          visibleColumns={['id', 'name', 'description']}
          viewRecordPerms="module.erm.enabled"
          newRecordPerms="module.erm.enabled"
          onCreate={this.create}
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult
          columnMapping={{
            id: 'ID',
            name: 'Name',
            description: 'Description'
          }}
          columnWidths={{
            id: 300,
            name: 300,
            description: 'auto',
          }}
        />
      </React.Fragment>
    );
  }
}

export default Agreements;
