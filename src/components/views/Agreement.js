import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import { Spinner } from '@folio/stripes-erm-components';
import DuplicateAgreementModal from '../DuplicateAgreementModal';

import {
  ControllingLicense,
  ExternalLicenses,
  FutureLicenses,
  Header,
  HistoricalLicenses,
  Info,
  InternalContacts,
  Lines,
  Organizations,
  OtherPeriods,
  SupplementaryInfo,
  Terms,
  UsageData,
} from '../AgreementSections';

import { urls } from '../utilities';

export default class Agreement extends React.Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    data: PropTypes.shape({
      agreement: PropTypes.object.isRequired,
    }).isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    helperApp: PropTypes.node,
    isLoading: PropTypes.bool.isRequired,
  }

  state = {
    showDuplicateAgreementModal: false,
    sections: {
      controllingLicense: false,
      externalLicenses: false,
      futureLicenses: false,
      historicalLicenses: false,
      internalContacts: false,
      licenses: false,
      lines: false,
      notes: false,
      organizations: false,
      otherPeriods: false,
      supplementaryInfo: false,
      terms: false,
      usageData: false,
    },
  }

  getSectionProps = (id) => {
    const { data, handlers } = this.props;

    return {
      agreement: data.agreement,
      data,
      id,
      handlers,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
    };
  }

  openDuplicateAgreementModal = () => {
    this.setState({ showDuplicateAgreementModal: true });
  }

  closeDuplicateAgreementModal = () => {
    this.setState({ showDuplicateAgreementModal: false });
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  getActionMenu = (onToggle) => (
    <Fragment>
      <IfPermission perm="ui-agreements.agreements.edit">
        <FormattedMessage id="ui-agreements.agreements.editAgreement">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonStyle="dropdownItem"
              id="clickable-dropdown-edit-agreement"
              onClick={this.props.handlers.onEdit}
            >
              <Icon icon="edit">
                <FormattedMessage id="ui-agreements.agreements.editAgreement" />
              </Icon>
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>
      <FormattedMessage id="ui-agreements.agreements.editAgreement">
        {ariaLabel => (
          <Button
            aria-label={ariaLabel}
            buttonStyle="dropdownItem"
            id="clickable-dropdownduplicate-agreement"
            onClick={() => {
              this.openDuplicateAgreementModal();
              onToggle();
            }}
          >
            <Icon icon="duplicate">
              <FormattedMessage id="ui-agreements.duplicate" />
            </Icon>
          </Button>
        )}
      </FormattedMessage>

    </Fragment>
  )

  renderEditAgreementPaneMenu = () => {
    const {
      data: { agreement },
      handlers,
    } = this.props;

    return (
      <IfPermission perm="ui-agreements.agreements.edit">
        <PaneMenu>
          {handlers.onToggleTags &&
            <FormattedMessage id="ui-agreements.agreements.showTags">
              {ariaLabel => (
                <IconButton
                  icon="tag"
                  id="clickable-show-tags"
                  badgeCount={get(agreement, 'tags.length', 0)}
                  onClick={handlers.onToggleTags}
                  ariaLabel={ariaLabel}
                />
              )}
            </FormattedMessage>
          }
          <FormattedMessage id="ui-agreements.agreements.editAgreement">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-edit-agreement"
                marginBottom0
                onClick={handlers.onEdit}
              >
                <FormattedMessage id="stripes-components.button.edit" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="60%"
        dismissible
        id="pane-view-agreement"
        onClose={this.props.handlers.onClose}
        paneTitle={<FormattedMessage id="ui-agreements.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  render() {
    const {
      data,
      isLoading,
      handlers,
      helperApp
    } = this.props;

    const { showDuplicateAgreementModal } = this.state;

    if (isLoading) return this.renderLoadingPane();

    return (
      <React.Fragment>
        <Pane
          actionMenu={({ onToggle }) => this.getActionMenu(onToggle)}
          appIcon={<AppIcon app="agreements" />}
          defaultWidth="60%"
          dismissible
          id="pane-view-agreement"
          lastMenu={this.renderEditAgreementPaneMenu()}
          onClose={handlers.onClose}
          paneTitle={data.agreement.name}
        >
          <TitleManager record={data.agreement.name}>
            <Header {...this.getSectionProps()} />
            <Info {...this.getSectionProps('info')} />
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={this.state.sections}
                    id="clickable-expand-all"
                    onToggle={this.handleAllSectionsToggle}
                  />
                </Col>
              </Row>
              <InternalContacts {...this.getSectionProps('internalContacts')} />
              <Lines {...this.getSectionProps('lines')} />
              <ControllingLicense {...this.getSectionProps('controllingLicense')} />
              <FutureLicenses {...this.getSectionProps('futureLicenses')} />
              <HistoricalLicenses {...this.getSectionProps('historicalLicenses')} />
              <ExternalLicenses {...this.getSectionProps('externalLicenses')} />
              <Terms {...this.getSectionProps('terms')} />
              <Organizations {...this.getSectionProps('organizations')} />
              <OtherPeriods {...this.getSectionProps('otherPeriods')} />
              <SupplementaryInfo {...this.getSectionProps('supplementaryInfo')} />
              <UsageData {...this.getSectionProps('usageData')} />
              <NotesSmartAccordion
                {...this.getSectionProps('notes')}
                domainName="agreements"
                entityId={data.agreement.id}
                entityName={data.agreement.name}
                entityType="agreement"
                pathToNoteCreate={urls.noteCreate()}
                pathToNoteDetails={urls.notes()}
              />
            </AccordionSet>
          </TitleManager>
        </Pane>
        {helperApp}
        {showDuplicateAgreementModal && <DuplicateAgreementModal onClose={this.closeDuplicateAgreementModal} />}
      </React.Fragment>

    );
  }
}
