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
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderAgreements = (eresource) => {
    const { entitlements = [] } = this.props.data;
    const { id } = this.props;

    return (
      <AgreementsList
        eresource={eresource}
        id={id}
        resources={entitlements}
      />
    );
  }

  renderBadge = () => {
    const { entitlements, relatedEntitlements = [] } = this.props.data;
    const count = entitlements.length + relatedEntitlements.length;
    return entitlements?.length ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const {
      data: { entitlements, eresource },
      id,
      onToggle,
      open,
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
        onToggle={onToggle}
        open={open}
      >
        {entitlements ? this.renderAgreements(eresource) : <Spinner />}
      </Accordion>
    );
  }
}
