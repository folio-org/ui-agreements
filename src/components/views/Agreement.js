import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, difference, get, keyBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { withTags, NotesSmartAccordion } from '@folio/stripes/smart-components';

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
import { Spinner } from '@folio/stripes-erm-components';

import {
  AgreementHeader,
  AgreementInfo,
} from '../AgreementSections';

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
      agreementNotes: false,
    },
  }

  getSectionProps = (id) => {
    const { data: { agreement }, handlers } = this.props;

    return {
      agreement,
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
        defaultWidth="45%"
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
          defaultWidth="45%"
          dismissible
          id="pane-view-agreement"
          lastMenu={this.renderEditAgreementPaneMenu()}
          onClose={handlers.onClose}
          paneTitle={data.agreement.name}
        >
          <TitleManager record={data.agreement.name}>
            <AgreementHeader {...this.getSectionProps()} />
            <AgreementInfo {...this.getSectionProps('agreementInfo')} />
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
                </Col>
              </Row>
              <NotesSmartAccordion
                {...this.getSectionProps('agreementNotes')}
                domainName="agreements"
                entityId={data.agreement.id}
                entityName={data.agreement.name}
                entityType="agreement"
                pathToNoteCreate="notes/create"
                pathToNoteDetails="notes"
              />
            </AccordionSet>
          </TitleManager>
        </Pane>
        {helperApp}
      </React.Fragment>

    );
  }
}
