import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import POLineCard from './POLineCard';

class POLineCardContainer extends React.Component {
  static manifest = Object.freeze({
    orderLine: {
      type: 'okapi',
      path: 'orders/order-lines/!{id}',
    },
    order: {
      type: 'okapi',
      path: 'orders/composite-orders/!{orderId}',
      fetch: false,
      accumulate: true,
    },
    organization: {
      type: 'okapi',
      path: 'organizations-storage/organizations/!{organizationId}',
      fetch: false,
      accumulate: true,
    }
  });

  static propTypes = {
    // `id` is used in the `manifest` for fetching `orderLine`
    // eslint-disable-next-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
    mutator: PropTypes.shape({
      order: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }),
      organization: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }),
    }),
    resources: PropTypes.shape({
      order: PropTypes.object,
      orderLine: PropTypes.object,
      organization: PropTypes.object,
    })
  }

  componentDidUpdate(prevProps) {
    const prevOrderId = get(prevProps.resources, 'orderLine.records[0].purchaseOrderId');
    const currOrderId = get(this.props.resources, 'orderLine.records[0].purchaseOrderId');
    if (prevOrderId !== currOrderId) {
      this.fetchOrder(currOrderId);
    }

    const prevVendorId = get(prevProps.resources, 'order.records[0].vendor');
    const currVendorId = get(this.props.resources, 'order.records[0].vendor');
    if (prevVendorId !== currVendorId) {
      this.fetchOrganization(currVendorId);
    }
  }

  fetchOrder = (orderId) => {
    this.props.mutator.order.GET({
      path: `orders/composite-orders/${orderId}`
    });
  }

  fetchOrganization = (organizationId) => {
    this.props.mutator.organization.GET({
      path: `organizations-storage/organizations/${organizationId}`
    });
  }

  render() {
    const { resources } = this.props;
    const orderLine = get(resources, 'orderLine.records[0]');
    const order = get(resources, 'order.records[0]');
    const organization = get(resources, 'organization.records[0]');

    return (
      <POLineCard
        orderLine={orderLine}
        order={order}
        organization={organization}
      />
    );
  }
}

export default stripesConnect(POLineCardContainer);
