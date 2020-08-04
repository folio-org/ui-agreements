import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Spinner
} from '@folio/stripes/components';

import { resourceClasses } from '../../constants';
import EntitlementAgreementsList from '../EntitlementsAgreementsList';

export default class Agreements extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlements: PropTypes.arrayOf(PropTypes.object),
      eresource: PropTypes.shape({
        class: PropTypes.string,
        pti: PropTypes.shape({
          titleInstance: PropTypes.shape({
            name: PropTypes.string,
          })
        }),
        type: PropTypes.object,
      }),
      relatedEntitlements: PropTypes.arrayOf(PropTypes.object),
    }),
    headline: PropTypes.node,
    isEmptyMessage: PropTypes.node,
    renderRelatedEntitlements: PropTypes.bool,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
  };

  renderEntitlementAgreements = () => {
    const { entitlements = [] } = this.props.data;
    const { headline, isEmptyMessage, visibleColumns } = this.props;

    return (
      <EntitlementAgreementsList
        entitlements={entitlements}
        headline={headline}
        id="pci-agreements-list"
        isEmptyMessage={isEmptyMessage}
        visibleColumns={visibleColumns}
      />
    );
  }

  renderRelatedEntitlementAgreements = () => {
    const { eresource, relatedEntitlements = [] } = this.props.data;

    return (
      <EntitlementAgreementsList
        entitlements={relatedEntitlements}
        headline={<FormattedMessage
          id="ui-agreements.eresources.otherPlatformPackages"
          values={{ name: eresource?.pti?.titleInstance?.name }}
        />}
        id="related-agreements-list"
        isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsOtherPackages" />}
        visibleColumns={['name', 'type', 'package', 'startDate', 'endDate']}
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
      data: { entitlements, eresource, relatedEntitlements },
      renderRelatedEntitlements,
    } = this.props;

    const label = (eresource.class === resourceClasses.PACKAGE) ?
      <FormattedMessage id="ui-agreements.eresources.packageAgreements" /> :
      <FormattedMessage id="ui-agreements.eresources.erAgreements" />;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id="pci-agreements"
        label={label}
      >
        {entitlements ? this.renderEntitlementAgreements(entitlements) : <Spinner />}
        {renderRelatedEntitlements ? (
          relatedEntitlements ?
            this.renderRelatedEntitlementAgreements() :
            <Spinner />) : null}
      </Accordion>
    );
  }
}
