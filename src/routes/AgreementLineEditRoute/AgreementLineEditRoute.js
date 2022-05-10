import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import compose from 'compose-function';
import { isEmpty, chunk } from 'lodash';
import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import View from '../../components/views/AgreementLineForm';
import { urls, withSuppressFromDiscovery } from '../../components/utilities';
import { resultCount } from '../../constants';

const { RECORDS_PER_REQUEST_LARGE } = resultCount;
class AgreementLineEditRoute extends React.Component {
  static manifest = Object.freeze({
    entitlements: {
      type: 'okapi',
      path: 'erm/entitlements',
      fetch: false,
    },
    line: {
      type: 'okapi',
      path: 'erm/entitlements/:{lineId}',
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
    basket: { initialValue: [] },
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
      entitlements: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
      line: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func
      }),
      orderLines: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func
      }),
    }),
    resources: PropTypes.shape({
      basket: PropTypes.arrayOf(PropTypes.object),
      line: PropTypes.object,
      orderLines: PropTypes.object,
      settings: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      isEholdingsEnabled: props.stripes.hasPerm('module.eholdings.enabled'),
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

  getInitialValues = () => {
    const line = this.props.resources.line?.records?.[0] ?? {};

    return {
      ...line,
      linkedResource: line.type !== 'detached' ? line : undefined,
      coverage: line.customCoverage ? line.coverage : undefined,
    };
  }

  handleClose = () => {
    const {
      history,
      location,
      match: { params: { agreementId, lineId } },
    } = this.props;
    history.push(`${urls.agreementLineView(agreementId, lineId)}${location.search}`);
  }

  /* istanbul ignore next */
  handleSubmit = (line) => {
    const {
      history,
      location,
      match: { params: { agreementId, lineId } },
      mutator,
    } = this.props;

    let payload; // payload to be PUT to the endpoint
    const { linkedResource, type, ...rest } = line;
    if (linkedResource?.type === 'packages') { // On submitting a package selected from eholdings plugin
      payload = {
        'type': 'external',
        'authority': 'ekb-package',
        'reference': linkedResource.id,
        ...rest,
        resource: null
      };
    } else if (linkedResource?.type === 'resources') { // On submitting a title selected from eholdings plugin
      payload = {
        'type': 'external',
        'authority': 'ekb-title',
        'reference': linkedResource.id,
        ...rest,
        resource: null
      };
    } else if (isEmpty(linkedResource)) { // On editing a detached line but not adding a resource
      payload = { 'type': 'detached', ...rest, resource: null };
    } else if (type === 'detached') { // on editing a detached line and adding a resource
      payload = { resource: linkedResource, ...rest, type: null };
    } else if (type === 'external') { // on editing an external line
      payload = { resource: null, ...rest, type: 'external' };
    } else { // on editing an internal line
      payload = { resource: linkedResource, ...rest, type };
    }

    return mutator.entitlements
      .PUT({
        id: lineId,
        ...payload
      })
      .then(({ id }) => {
        this.context.sendCallout({ message: <FormattedMessage id="ui-agreements.line.update.callout" /> });
        history.push(`${urls.agreementLineView(agreementId, id)}${location.search}`);
      });
  }

  isLoading = () => {
    return Object.values(this.props.resources).some(r => r.resource !== 'settings' && r.isPending);
  }

  render() {
    const { match, resources, isSuppressFromDiscoveryEnabled } = this.props;

    if (this.isLoading() || this.state.isLoading) return <LoadingView dismissible onClose={this.handleClose} />;

    return (
      <View
        key={resources.line?.loadedAt ?? 'loading'}
        data={{
          basket: (resources?.basket ?? []),
          line: this.getCompositeLine(),
        }}
        handlers={{
          ...this.props.handlers,
          isSuppressFromDiscoveryEnabled,
          onClose: this.handleClose,
        }}
        initialValues={this.getInitialValues()}
        isEholdingsEnabled={this.state.isEholdingsEnabled}
        isLoading={this.isLoading() || this.state.isLoading}
        lineId={match.params.lineId}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
)(AgreementLineEditRoute);
