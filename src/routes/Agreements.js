import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { SearchAndSort } from '@folio/stripes/smart-components';

import ViewAgreement from '../components/Agreements/ViewAgreement';
import EditAgreement from '../components/Agreements/EditAgreement';
import getSASParams from '../util/getSASParams';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

// `label` and `values` will be filled in by `updateFilterConfig`
// `cql` is defined to mute PropType checks by SAS and FilterGroups
const filterConfig = [
  { name: 'agreementStatus', label: '', cql: '', values: [] },
  { name: 'renewalPriority', label: '', cql: '', values: [] },
  { name: 'isPerpetual', label: '', cql: '', values: [] },
];

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
        }
      }),
    },
    selectedAgreement: {
      type: 'okapi',
      path: 'erm/sas/${selectedAgreementId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
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
    selectedAgreementId: { initialValue: '' },
    agreementFiltersInitialized: { initialValue: false },
  });

  static propTypes = {
    resources: PropTypes.object,
    mutator: PropTypes.object,
    stripes: PropTypes.object,
  };

  componentDidUpdate() {
    if (!this.props.resources.agreementFiltersInitialized) {
      this.updateFilterConfig();
    }
  }

  updateFilterConfig() {
    // Define the list of filters we support and are fetching values for.
    const filters = [
      'agreementStatus',
      'renewalPriority',
      'isPerpetual'
    ];

    // Get the records for those filters
    const records = filters
      .map(filter => `${filter}Values`)
      .map(name => get(this.props.resources[name], ['records'], []));

    // If we've fetched the records for every filter...
    if (records.every(record => record.length)) {
      const { stripes: { intl } } = this.props;
      // ...then for every filter...
      filters.forEach((filter, i) => {
        // ...set the filter's `values` and `label` properties
        const config = filterConfig.find(c => c.name === filter);
        config.values = records[i].map(r => ({ name: r.label, cql: r.value }));
        config.label = intl.formatMessage({ id: `ui-erm.agreements.${filter}` });
      });

      this.props.mutator.agreementFiltersInitialized.replace(true);
    }
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

  handleUpdate = (agreement) => {
    this.props.mutator.selectedAgreementId.replace(agreement.id);

    return this.props.mutator.selectedAgreement.PUT(agreement);
  }

  render() {
    const { mutator, resources, stripes: { intl } } = this.props;
    const path = '/erm/agreements';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="agreements"
          packageInfo={packageInfo}
          filterConfig={filterConfig}
          objectName="title"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewAgreement}
          editRecordComponent={EditAgreement}
          viewRecordPerms="module.erm.enabled"
          newRecordPerms="module.erm.enabled"
          onCreate={this.handleCreate}
          detailProps={{
            onUpdate: this.handleUpdate
          }}
          // SearchAndSort expects the resource it's going to list to be under the `records` key.
          // However, if we just put it under `records` in the `manifest`, it would clash with
          // the `records` that would need to be defined by the Agreements tab.
          parentResources={{
            ...resources,
            records: resources.agreements,
          }}
          parentMutator={{
            ...mutator,
            records: mutator.agreements,
          }}
          showSingleResult
          visibleColumns={[
            'name',
            'vendor',
            'startDate',
            'endDate',
            'cancellationDeadline',
            'agreementStatus',
            'lastUpdated'
          ]}
          columnMapping={{
            name: intl.formatMessage({ id: 'ui-erm.agreements.name' }),
            vendor: intl.formatMessage({ id: 'ui-erm.agreements.vendorInfo.vendor' }),
            startDate: intl.formatMessage({ id: 'ui-erm.agreements.startDate' }),
            endDate: intl.formatMessage({ id: 'ui-erm.agreements.endDate' }),
            cancellationDeadline: intl.formatMessage({ id: 'ui-erm.agreements.cancellationDeadline' }),
            agreementStatus: intl.formatMessage({ id: 'ui-erm.agreements.agreementStatus' }),
            lastUpdated: intl.formatMessage({ id: 'ui-erm.lastUpdated' }),
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
          resultsFormatter={{
            vendor: a => a.vendor && a.vendor.name,
            startDate: a => a.startDate && intl.formatDate(a.startDate),
            endDate: a => a.endDate && intl.formatDate(a.endDate),
            cancellationDeadline: a => a.cancellationDeadline && intl.formatDate(a.cancellationDeadline),
            agreementStatus: a => a.agreementStatus && a.agreementStatus.label,
          }}
        />
      </React.Fragment>
    );
  }
}

export default Agreements;
