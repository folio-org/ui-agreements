import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Spinner
} from '@folio/stripes/components';

import { resourceClasses } from '../../../constants';
import EntitlementAgreementsList from '../../EntitlementsAgreementsList';

const propTypes = {
  data: PropTypes.shape({
    areEntitlementsLoading: PropTypes.bool,
    areRelatedEntitlementsLoading: PropTypes.bool,
    entitlements: PropTypes.arrayOf(PropTypes.object),
    entitlementsCount: PropTypes.number,
    eresource: PropTypes.shape({
      id: PropTypes.string.isRequired,
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
  id: PropTypes.string,
  isEmptyMessage: PropTypes.node,
  renderRelatedEntitlements: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

const Agreements = ({
  data: {
    entitlements,
    eresource,
    relatedEntitlements,
    areEntitlementsLoading,
    areRelatedEntitlementsLoading,
    entitlementsCount
  },
  renderRelatedEntitlements,
  id,
  headline,
  isEmptyMessage,
  visibleColumns
}) => {
  const renderEntitlementAgreements = () => {
    if (areEntitlementsLoading || !entitlements) {
      return <Spinner />;
    }

    return (
      <EntitlementAgreementsList
        entitlements={entitlements ?? []}
        eresourceId={eresource.id}
        headline={headline}
        id="pci-agreements-list"
        isEmptyMessage={isEmptyMessage}
        totalCount={entitlementsCount}
        visibleColumns={visibleColumns}
      />
    );
  };

  const renderRelatedEntitlementAgreements = () => {
    if (!renderRelatedEntitlements) {
      return null;
    }

    if (areRelatedEntitlementsLoading || !relatedEntitlements) {
      return <Spinner />;
    }

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
  };

  const renderBadge = () => {
    return (
      entitlements &&
      relatedEntitlements &&
      !areEntitlementsLoading &&
      !areRelatedEntitlementsLoading
    ) ?
      <Badge>{entitlementsCount + relatedEntitlements?.length}</Badge> :
      <Spinner />;
  };

  const label = (eresource.class === resourceClasses.PACKAGE) ?
    <FormattedMessage id="ui-agreements.eresources.packageAgreements" /> :
    <FormattedMessage id="ui-agreements.eresources.erAgreements" />;

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id={id}
      label={label}
    >
      {renderEntitlementAgreements()}
      {renderRelatedEntitlementAgreements()}
    </Accordion>
  );
};

Agreements.propTypes = propTypes;
export default Agreements;

