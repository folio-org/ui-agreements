import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, Button, Dropdown, DropdownMenu, Icon, Spinner } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { ColumnManagerMenu, useColumnManager } from '@folio/stripes/smart-components';

import { LINE_LISTING_COLUMN_MAPPING } from '../../../constants';
import { urls } from '../../utilities';
import CoveredEResourcesList from '../CoveredEResourcesList';
import LinesList from '../LinesList';

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
    onViewAgreementLine: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string,
};

const Lines = ({
  agreement,
  eresourcesFilterPath,
  handlers,
  id,
  accessControlData = {}
}) => {
  const {
    canEdit = true,
    canEditLoading = false,
  } = accessControlData;

  const { visibleColumns, toggleColumn } = useColumnManager('line-listing-column-manager', LINE_LISTING_COLUMN_MAPPING);
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
                disabled={canEditLoading || !canEdit}
                id="add-agreement-line-button"
                to={canEditLoading || !canEdit ? null : urls.agreementLineCreate(agreement.id)}
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
            <ColumnManagerMenu
              columnMapping={LINE_LISTING_COLUMN_MAPPING}
              excludeColumns={['name']}
              prefix="line-listing"
              toggleColumn={toggleColumn}
              visibleColumns={visibleColumns}
            />
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
        onViewAgreementLine={handlers.onViewAgreementLine}
        visibleColumns={visibleColumns}
      />
      <CoveredEResourcesList
        agreement={agreement}
        eresourcesFilterPath={eresourcesFilterPath}
        onExportEResourcesAsJSON={handlers.onExportEResourcesAsJSON}
        onExportEResourcesAsKBART={handlers.onExportEResourcesAsKBART}
        onFilterEResources={handlers.onFilterEResources}
      />
    </Accordion>
  );
};

Lines.propTypes = propTypes;
export default Lines;
