import React from 'react';
import PropTypes from 'prop-types';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import View from '../components/views/AgreementLine';
import { urls } from '../components/utilities';

class AgreementLineViewRoute extends React.Component {
  static manifest = Object.freeze({
    line: {
      type: 'okapi',
      path: 'erm/entitlements/:{lineId}',
    },
    orderLines: {
      type: 'okapi',
      path: 'orders/order-lines',
      params: (_q, _p, _r, _l, props) => {
        const query = props.resources.line?.poLines ?? []
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

    line.poLines = (line.poLines || [])
      .map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId));

    return line;
  }

  handleClose = () => {
    const { history, location, match } = this.props;
    history.push(`${urls.agreementView(match.params.agreementId)}${location.search}`);
  }

  handleEdit = () => {
    const {
      history,
      location,
      match: { params: { agreementId, lineId }}
    } = this.props;

    history.push(`${urls.agreementLineEdit(agreementId, lineId)}${location.search}`);
  }

  isLoading = () => {
    const { match, resources } = this.props;

    return (
      match.params.lineId !== resources.line?.records?.[0]?.id &&
      (resources?.line?.isPending ?? true)
    );
  }

  render() {
    const {
      resources,
      stripes,
    } = this.props;

    return (
      <View
        key={resources.line?.loadedAt ?? 'loading'}
        canEdit={stripes.hasPerm('ui-agreements.agreements.edit')}
        data={{
          line: this.getCompositeLine()
        }}
        handlers={{
          onClose: this.handleClose,
          onEdit: this.handleEdit,
        }}
        isLoading={this.isLoading()}
      />
    );
  }
}

export default stripesConnect(AgreementLineViewRoute);
