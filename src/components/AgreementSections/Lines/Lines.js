import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import { Button, Accordion, Badge, Spinner, Icon } from '@folio/stripes/components';

import CoveredEResourcesList from '../CoveredEResourcesList';
import LinesList from '../LinesList';
import { urls } from '../../utilities';


export default class Lines extends React.Component {
  static propTypes = {
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
  }

  getActionMenu = () => {
    const buttons = [];
    buttons.push(
      <IfPermission perm="ui-agreements.agreements.edit">
        <Button buttonStyle="dropdownItem" id="add-agreement-line-button" to={urls.agreementLineCreate(this.props.agreement.id)}>
          <Icon icon="plus-sign" />
          <FormattedMessage id="ui-agreements.agreementLines.newLine" />
        </Button>
      </IfPermission>
    );
    buttons.push(
      <IfPermission perm="ui-agreements.agreements.edit">
        <Button
          buttonStyle="dropdownItem"
          id="add-agreement-line-button"
          // to={`${urls.agreementlines()}?filters=agreement.${agreementId}`}
        >
          <Icon icon="search" />
          <FormattedMessage id="ui-agreements.agreementLines.viewInSearch" />
        </Button>
      </IfPermission>
    );
    return buttons.length ? buttons : null;
  }

  renderBadge = () => {
    const count = this.props.agreement?.agreementLinesCount;
    return count !== undefined ? <Badge data-test-agreement-lines-count={count}>{count}</Badge> : <Spinner />;
  }

  render() {
    const {
      agreement,
      eresourcesFilterPath,
      handlers,
      id,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.getActionMenu()}
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
  }
}
