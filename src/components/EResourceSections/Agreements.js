import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Spinner
} from '@folio/stripes/components';

import { resourceClasses } from '../../constants';
import AgreementsList from './AgreementsList';

export default class Agreements extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlements: PropTypes.array,
      eresource: PropTypes.shape({
        class: PropTypes.string,
        type: PropTypes.object,
      }),
      relatedEntitlements: PropTypes.array,
    }),
    id: PropTypes.string,
    headline: PropTypes.node,
    isEmptyMessage: PropTypes.node,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
  };

  renderAgreements = (eresource) => {
    const { entitlements = [] } = this.props.data;
    const { headline, id, isEmptyMessage, visibleColumns } = this.props;

    return (
      <AgreementsList
        eresource={eresource}
        headline={headline}
        id={id}
        isEmptyMessage={isEmptyMessage}
        resources={entitlements}
        visibleColumns={visibleColumns}
      />
    );
  }

  renderBadge = () => {
    const { entitlements, relatedEntitlements } = this.props.data;

    return (entitlements && relatedEntitlements) ?
      <Badge>{entitlements?.length + relatedEntitlements?.length}</Badge>
      :
      <Spinner />;
  }

  render() {
    const {
      data: { entitlements, eresource },
      id,
    } = this.props;

    const label = (eresource.class === resourceClasses.PKG) ?
      <FormattedMessage id="ui-agreements.eresources.packageAgreements" /> :
      <FormattedMessage id="ui-agreements.eresources.erAgreements" />;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={label}
      >
        {entitlements ? this.renderAgreements(eresource) : <Spinner />}
      </Accordion>
    );
  }
}
