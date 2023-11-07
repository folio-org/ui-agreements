import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import { Button, Accordion, Badge, Spinner, Icon, Dropdown, DropdownMenu } from '@folio/stripes/components';

import CoveredEResourcesList from '../CoveredEResourcesList';
import LinesList from '../LinesList';
import { urls } from '../../utilities';

const propTypes = {
  agreement: PropTypes.shape({
    agreementLinesCount: PropTypes.number,
    eresources: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    lines: PropTypes.arrayOf(PropTypes.object),
    orderLines: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  eresourcesFilterPath: PropTypes.string,
  handlers: PropTypes.shape({
    onExportEResourcesAsJSON: PropTypes.func.isRequired,
    onExportEResourcesAsKBART: PropTypes.func.isRequired,
    onFilterEResources: PropTypes.func.isRequired,
    onNeedMoreEResources: PropTypes.func.isRequired,
    onNeedMoreLines: PropTypes.func.isRequired,
    onViewAgreementLine: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string,
};

const Lines = ({
  agreement,
  eresourcesFilterPath,
  handlers,
  id,
}) => {
  const renderBadge = () => {
    const count = agreement?.agreementLinesCount;
    return count !== undefined ? <Badge data-test-agreement-lines-count={count}>{count}</Badge> : <Spinner />;
  };

  const getActionMenu = () => {
    return (
      <>
        <Dropdown
          buttonProps={{ buttonStyle: 'primary' }}
          data-testid="line-listing-action-dropdown"
          label={<FormattedMessage id="ui-agreements.actions" />}
        >
          <DropdownMenu>
            <IfPermission perm="ui-agreements.agreements.edit">
              <Button
                buttonStyle="dropdownItem"
                id="add-agreement-line-button"
                to={urls.agreementLineCreate(agreement.id)}
              >
                <Icon icon="plus-sign">
                  <FormattedMessage id="ui-agreements.agreementLines.newLine" />
                </Icon>
              </Button>
            </IfPermission>
            <Button
              buttonStyle="dropdownItem"
              id="agreement-line-search"
              to={`${urls.agreementLines()}?filters=agreement.${agreement.id}`}
            >
              <Icon icon="search">
                <FormattedMessage id="ui-agreements.agreementLines.viewInSearch" />
              </Icon>
            </Button>
          </DropdownMenu>
        </Dropdown>
        {renderBadge()}
      </>
    );
  };

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={getActionMenu()}
      id={id}
      label={<FormattedMessage id="ui-agreements.agreementLines" />}
    >
      <LinesList
        agreement={agreement}
        onNeedMoreLines={handlers.onNeedMoreLines}
        onViewAgreementLine={handlers.onViewAgreementLine}
      />
      <CoveredEResourcesList
        agreement={agreement}
        eresourcesFilterPath={eresourcesFilterPath}
        onExportEResourcesAsJSON={handlers.onExportEResourcesAsJSON}
        onExportEResourcesAsKBART={handlers.onExportEResourcesAsKBART}
        onFilterEResources={handlers.onFilterEResources}
        onNeedMoreEResources={handlers.onNeedMoreEResources}
      />
    </Accordion>
  );
};

Lines.propTypes = propTypes;
export default Lines;
