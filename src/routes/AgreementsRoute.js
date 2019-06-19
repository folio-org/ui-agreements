import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { getSASParams } from '@folio/stripes-erm-components';

import View from '../components/views/Agreements';
import NoPermissions from '../components/NoPermissions';
import { urls } from '../components/utilities';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

class AgreementsRoute extends React.Component {
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
          tags: 'tags.value',
        },
      }),
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementStatus',
      shouldRefresh: () => false,
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/renewalPriority',
      shouldRefresh: () => false,
    },
    isPerpetualValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/isPerpetual',
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreementOrg/role',
      shouldRefresh: () => false,
    },
    tagsValues: {
      type: 'okapi',
      path: 'tags?limit=100',
      records: 'tags',
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-agreements.agreements.view'),
    };
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'agreements');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'agreements');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.agreementView(record.id)}${location.search}`);
      }
    }
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues, state }) => {
    const defaults = {
      filters: null,
      query: null,
      sort: null,
    };

    if (/reset/.test(state.changeType)) {
      // A mutator's `replace()` function doesn't update the URL of the page. As a result,
      // we always use `update()` but fully specify the values we want to null out.
      this.props.mutator.query.update({ ...defaults, ...nsValues });
    } else {
      this.props.mutator.query.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  render() {
    const { children, location, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'agreements');
    }

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <View
        data={{
          agreements: get(resources, 'agreements.records', []),
          agreementStatusValues: get(resources, 'agreementStatusValues.records', []),
          renewalPriorityValues: get(resources, 'renewalPriorityValues.records', []),
          isPerpetualValues: get(resources, 'isPerpetualValues.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          tags: get(resources, 'tags.records', []),
        }}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        source={this.source}
      >
        {children}
      </View>
    );
  }
}

export default stripesConnect(AgreementsRoute);
