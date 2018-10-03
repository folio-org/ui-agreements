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
      path: 'erm/sas',
      resourceShouldRefresh: true,
      records: 'results',
      params: (queryParams, pathComponents, resources) => {
        const params = {
          stats: 'true',
        };

        const { query: { query, filters, sort } } = resources;

        if (query) {
          params.match = ['name', 'description'];
          params.term = query;
        }

        return params;
      },
    },
    agreementTypeValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementType',
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/renewalPriority',
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementStatus',
    },
    isPerpetualValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/isPerpetual',
    },
    contentReviewNeededValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/contentReviewNeeded',
    },
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
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
