import React from 'react';
import PropTypes from 'prop-types';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import View from '../components/views/AgreementLineForm';
import { urls } from '../components/utilities';

class AgreementLineEditRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{agreementId}',
      fetch: false,
    },
    line: {
      type: 'okapi',
      path: 'erm/entitlements/:{lineId}',
    },
    orderLines: {
      type: 'okapi',
      path: 'orders/order-lines',
      params: (_q, _p, _r, _l, props) => {
        const query = (props.resources.line?.records?.[0]?.poLines ?? [])
          .map(poLine => `id==${poLine.poLineId}`)
          .join(' or ');

        return query ? { query } : null;
      },

      fetch: props => !!props.stripes.hasInterface('order-lines', '1.0'),
      records: 'poLines',
      throwErrors: false,
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
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
      }),
    }),
    resources: PropTypes.shape({
      line: PropTypes.object,
      orderLines: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  getCompositeLine = () => {
    const { resources } = this.props;
    const line = resources.line?.records?.[0] ?? {};
    const orderLines = resources.orderLines?.records || [];

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

  handleSubmit = (line) => {
    const {
      history,
      location,
      match: { params: { agreementId, lineId } },
      mutator,
    } = this.props;

    return mutator.agreement
      .PUT({
        id: agreementId,
        items: [{ id: lineId, ...line }]
      })
      .then(() => {
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-agreements.line.update.callout" /> });
        history.push(`${urls.agreementLineView(agreementId, lineId)}${location.search}`);
      });
  }

  isLoading = () => {
    return Object.values(this.props.resources).some(r => r?.isPending ?? true);
  }

  render() {
    const { resources } = this.props;

    if (this.isLoading()) return <LoadingView dismissible onClose={this.handleClose} />;

    return (
      <View
        key={resources.line?.loadedAt ?? 'loading'}
        data={{
          line: this.getCompositeLine()
        }}
        handlers={{
          onClose: this.handleClose,
        }}
        initialValues={resources.line?.records?.[0]}
        isLoading={this.isLoading()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(AgreementLineEditRoute);
