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

import { IfPermission } from '@folio/stripes/core';

import {
  Agreements,
  AgreementsList,
  PCICoverage,
  PCIInfo,
  ParentPackageDetails,
  TitleInfo,
} from '../EResourceSections';

export default class PCI extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.shape({
          label: PropTypes.string,
        }),
      }).isRequired,
      relatedEntitlements: PropTypes.array,
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    isLoading: PropTypes.bool,
  }

  state = {
    sections: {
      coverage: true,
      pciagreements: true
    },
  }

  getSectionProps = (id) => {
    const { data } = this.props;

    return {
      data,
      id,
      pci: data.eresource,
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
        paneTitle={<FormattedMessage id="ui-agreements.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  renderEditMenu = () => (
    <PaneMenu>
      <IfPermission perm="ui-agreements.resources.edit">
        <FormattedMessage id="ui-agreements.eresources.edit">
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
      </IfPermission>
    </PaneMenu>
  );

  renderPCIInfo = (eresource) => <PCIInfo pci={eresource} />;

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
      data: { eresource, relatedEntitlements = [] },
      isLoading,
    } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <div id="eresource-pci">
        {this.renderPCIInfo(eresource)}
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
          <PCICoverage {...this.getSectionProps('coverage')} />
          <Agreements {...this.getSectionProps('pciagreements')} />
          <AgreementsList
            eresource={eresource}
            id="pcirelatedagreements"
            isRelatedEntitlement
            resources={relatedEntitlements}
          />
        </AccordionSet>
      </div>
    );
  }
}
