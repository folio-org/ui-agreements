import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import { Button, Accordion, Badge, Spinner, MenuSection } from '@folio/stripes/components';

import CoveredEResourcesList from '../CoveredEResourcesList';
import LinesList from '../LinesList';
import { urls } from '../../utilities';

const intl = useIntl();

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

  renderAddAgreementLineButtonAndBadge = () => {
    return (
      <>
        <MenuSection
          label={<FormattedMessage id="ui-agreements.actions" />}
          id="actions-menu-section"
        >
          <IfPermission perm="ui-agreements.agreements.edit">
            <PaneMenu>
              <FormattedMessage id="stripes-smart-components.addNew">
                {ariaLabel => (
                  <Button
                    id="add-agreement-line-button"
                    aria-label={ariaLabel}
                    to={urls.agreementLineCreate(this.props.agreement.id)}
                    buttonStyle="dropdownItem"
                    marginBottom0
                  >
                    <Icon icon="plus-sign">
                      <FormattedMessage id="stripes-smart-components.new" />
                    </Icon>
                  </Button>
                )}
              </FormattedMessage>
            </PaneMenu>
          </IfPermission>
          {/*<IfPermission perm="ui-users.lost-items.requiring-actual-cost">*/}
          {/*  <Button*/}
          {/*    id="requiring-actual-cost"*/}
          {/*    to="/users/lost-items"*/}
          {/*    buttonStyle="dropdownItem"*/}
          {/*  >*/}
          {/*    <Icon icon="edit">*/}
          {/*      <FormattedMessage id="ui-users.actionMenu.lostItems" />*/}
          {/*    </Icon>*/}
          {/*  </Button>*/}
          {/*</IfPermission>*/}
        </MenuSection>
        {/*<IfPermission perm="ui-agreements.agreements.edit">*/}
        {/*  <Button id="add-agreement-line-button" to={urls.agreementLineCreate(this.props.agreement.id)}>*/}
        {/*    <FormattedMessage id="ui-agreements.agreementLines.addLine" />*/}
        {/*  </Button>*/}
        {/*</IfPermission>*/}
        {this.renderBadge()}
      </>
    );
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
        displayWhenOpen={this.renderAddAgreementLineButtonAndBadge()}
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
