import React from 'react';
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

import {
  Header,
  Info,
  InternalContacts,
  Licenses,
  Lines,
  Organizations,
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
    sections: {
      internalContacts: false,
      licenses: false,
      lines: false,
      notes: false,
      organizations: false,
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

  getActionMenu = () => (
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
  )

  renderEditAgreementPaneMenu = () => {
    const {
      data: { agreement },
      handlers,
    } = this.props;

    return (
      <PaneMenu>
        { handlers.onToggleTags &&
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
        <IfPermission perm="ui-agreements.agreements.edit">
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
        </IfPermission>
      </PaneMenu>
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

    if (isLoading) return this.renderLoadingPane();

    return (
      <React.Fragment>
        <Pane
          actionMenu={this.getActionMenu}
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
                  <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
                </Col>
              </Row>
              <InternalContacts {...this.getSectionProps('internalContacts')} />
              <Lines {...this.getSectionProps('lines')} />
              <Licenses {...this.getSectionProps('licenses')} />
              <Terms {...this.getSectionProps('terms')} />
              <Organizations {...this.getSectionProps('organizations')} />
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
      </React.Fragment>

    );
  }
}
