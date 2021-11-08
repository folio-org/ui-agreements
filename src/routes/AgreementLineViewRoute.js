import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import compose from 'compose-function';
import { chunk } from 'lodash';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { Tags } from '@folio/stripes-erm-components';

import View from '../components/views/AgreementLine';
import { urls, withSuppressFromDiscovery } from '../components/utilities';
import { resultCount } from '../constants';

const { RECORDS_PER_REQUEST_LARGE } = resultCount;

class AgreementLineViewRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{agreementId}',
      fetch: false,
    },
    line: {
      type: 'okapi',
      path: 'erm/entitlements/:{lineId}',
      throwErrors: false,
      accumulate: true,
      fetch: false
    },
    orderLines: {
      type: 'okapi',
      perRequest: RECORDS_PER_REQUEST_LARGE,
      path: 'orders/order-lines',
      accumulate: true,
      fetch: false,
      records: 'poLines',
      throwErrors: false,
    },
    query: {},
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        agreementId: PropTypes.string.isRequired,
        lineId: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired,
    mutator: PropTypes.shape({
      agreement: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
      line: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func
      }),
      orderLines: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      line: PropTypes.object,
      orderLines: PropTypes.object,
      query: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static contextType = CalloutContext;


  constructor(props) {
    super(props);

    this.state = {
      orderLines: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    const results = await this.fetchOrderLines();
    this.setState({ orderLines: results, isLoading: false });
  }

  async fetchOrderLines() {
    this.props.mutator.line.reset();
    const agreementLine = await this.props.mutator.line.GET();
    const poLineIdsArray = ((agreementLine ?? {}).poLines ?? []).map(poLine => poLine.poLineId).flat();

    const CONCURRENT_REQUESTS = 5; // Number of requests to make concurrently
    const STEP_SIZE = 60; // Number of ids to request for per concurrent request

    const chunkedItems = chunk(poLineIdsArray, CONCURRENT_REQUESTS * STEP_SIZE); // Split into chunks of size CONCURRENT_REQUESTS * STEP_SIZE
    const data = [];
    for (const chunkedItem of chunkedItems) {  // Make requests concurrently
      this.props.mutator.orderLines.reset();
      const promisesArray = []; // Array of promises
      for (let i = 0; i < chunkedItem.length; i += STEP_SIZE) {
        promisesArray.push( // Add promises to array
          this.props.mutator.orderLines.GET({ // Make GET request
            params: {
              query: chunkedItem.slice(i, i + STEP_SIZE).map(item => `id==${item}`).join(' or '), // Make query string
              limit: 1000, // Limit to 1000
            },
          })
        );
      }
      const results = await Promise.all(promisesArray); // Wait for all requests to complete and move to the next chunk
      data.push(...results.flat()); // Add results to data
    }

    return data;
  }


  getHelperApp = () => {
    const { match, resources } = this.props;
    const helper = resources.query?.helper;
    if (!helper) return null;

    let HelperComponent = null;

    if (helper === 'tags') HelperComponent = Tags;

    if (!HelperComponent) return null;

    return (
      <HelperComponent
        link={`erm/entitlements/${match.params.lineId}`}
        onToggle={() => this.handleToggleHelper(helper)}
      />
    );
  }

  getCompositeLine = () => {
    const { resources } = this.props;
    const line = resources.line?.records?.[0] ?? {};
    const orderLines = this.state.orderLines;

    const poLines = (line.poLines || [])
      .map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId))
      .filter(poLine => poLine);

    return {
      ...line,
      poLines,
    };
  }

  handleClose = () => {
    const { history, location, match } = this.props;
    history.push(`${urls.agreementView(match.params.agreementId)}${location.search}`);
  }

  handleDelete = () => {
    const {
      history,
      location,
      match: { params: { agreementId, lineId } },
      mutator,
    } = this.props;
    const { sendCallout } = this.context;

    mutator.agreement.PUT({
      id: agreementId,
      items: [{ id: lineId, _delete: true }]
    })
      .then(() => {
        history.push(`${urls.agreementView(agreementId)}${location.search}`);
        sendCallout({ message: <FormattedMessage id="ui-agreements.line.delete.callout" /> });
      })
      .catch(error => {
        sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.line.deleteFailed.callout" values={{ message: error.message }} /> });
      });
  }

  handleEdit = () => {
    const {
      history,
      location,
      match: { params: { agreementId, lineId } },
    } = this.props;

    history.push(`${urls.agreementLineEdit(agreementId, lineId)}${location.search}`);
  }

  handleToggleHelper = (helper) => {
    const { mutator, resources } = this.props;
    const currentHelper = resources.query.helper;
    const nextHelper = currentHelper !== helper ? helper : null;

    mutator.query.update({ helper: nextHelper });
  }

  handleToggleTags = () => {
    this.handleToggleHelper('tags');
  }

  isLoading = () => {
    const { match, resources } = this.props;

    return (
      match.params.lineId !== resources.line?.records?.[0]?.id &&
      (resources?.line?.isPending ?? true)
    );
  }

  render() {
    const { resources, tagsEnabled, isSuppressFromDiscoveryEnabled } = this.props;

    return (
      <View
        key={resources.line?.loadedAt ?? 'loading'}
        data={{
          line: this.getCompositeLine(),
        }}
        handlers={{
          ...this.props.handlers,
          isSuppressFromDiscoveryEnabled,
          onClose: this.handleClose,
          onDelete: this.handleDelete,
          onEdit: this.handleEdit,
          onToggleTags: tagsEnabled ? this.handleToggleTags : undefined,
        }}
        helperApp={this.getHelperApp()}
        isLoading={this.isLoading() || this.state.isLoading}
      />
    );
  }
}

export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
  withTags,
)(AgreementLineViewRoute);
