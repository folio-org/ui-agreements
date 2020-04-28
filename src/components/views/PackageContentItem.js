import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Headline,
  Layout,
  Pane,
  PaneMenu,
  Row,
  Spinner,
} from '@folio/stripes/components';

// import { IfPermission } from '@folio/stripes/core';

import {
  Agreements,
  PackageContentItemCoverage,
  PackageContentItemInfo,
  ParentPackageDetails,
  TitleInfo,
} from '../EResourceSections';

export default class PackageContentItem extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.shape({
          label: PropTypes.string,
        }),
      }).isRequired,
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onDelete: PropTypes.func,
    }),
    isLoading: PropTypes.bool,
    urls: PropTypes.shape({
      editAmendment: PropTypes.func,
    }),
  }

  state = {
    sections: {
      coverage: false,
      agreements: false
    },
  }

  getSectionProps = (id) => {
    const { data } = this.props;

    return {
      data,
      pci: data.eresource,
      id,
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

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-pci"
        onClose={this.props.handlers.onClose}
        paneTitle={<FormattedMessage id="ui-licenses.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  renderEditMenu = () => (
    <PaneMenu>
      <FormattedMessage id="ui-licenses.amendments.create">
        {ariaLabel => (
          <Button
            aria-label={ariaLabel}
            buttonStyle="primary"
            id="clickable-edit-pci"
            marginBottom0
          >
            <FormattedMessage id="stripes-components.button.edit" />
          </Button>
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  renderPackageContentItemInfo = (eresource) => <PackageContentItemInfo pci={eresource} />;

  renderParentPackageDetails = ({ pkg = {} }) => (
    <div data-test-parent-package-details>
      <Headline margin="small" size="large" tag="h3">
        <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
      </Headline>
      <ParentPackageDetails pkg={pkg} />
    </div>
  );

  renderTitleDetails = () => (
    <div id="title-info">
      <Headline margin="small" size="large" tag="h3">
        <FormattedMessage id="ui-agreements.eresources.titleDetails" />
      </Headline>
      <TitleInfo data={this.props.data} />
    </div>
  );

  render() {
    const {
      data: { eresource },
      isLoading,
    } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <div id="eresource-pci">
        {this.renderPackageContentItemInfo(eresource)}
        {this.renderParentPackageDetails(eresource)}
        {this.renderTitleDetails()}
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
          <PackageContentItemCoverage {...this.getSectionProps('coverage')} />
          <Agreements {...this.getSectionProps('agreements')} />
        </AccordionSet>
      </div>
    );
  }
}
