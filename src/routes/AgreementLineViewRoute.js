import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { preventResourceRefresh } from '@folio/stripes-erm-components';
import View from '../components/views/AgreementLine';
import { urls } from '../components/utilities';

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
      shouldRefresh: preventResourceRefresh({ line: ['DELETE'] }),
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
      shouldRefresh: preventResourceRefresh({ line: ['DELETE'] }),
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
      }).isRequired,
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
        history.push(`${urls.agreements()}${location.search}`);
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

  isLoading = () => {
    const { match, resources } = this.props;

    return (
      match.params.lineId !== resources.line?.records?.[0]?.id &&
      (resources?.line?.isPending ?? true)
    );
  }

  render() {
    const { resources } = this.props;

    return (
      <View
        key={resources.line?.loadedAt ?? 'loading'}
        data={{
          line: this.getCompositeLine(),
        }}
        handlers={{
          onClose: this.handleClose,
          onDelete: this.handleDelete,
          onEdit: this.handleEdit,
        }}
        isLoading={this.isLoading()}
      />
    );
  }
}

export default stripesConnect(AgreementLineViewRoute);
