import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { AccordionSet, Accordion } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Layout from '@folio/stripes-components/lib/Layout';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Icon from '@folio/stripes-components/lib/Icon';
import Pane from '@folio/stripes-components/lib/Pane';

import {
  AgreementInfo,
  AgreementLines,
  AssociatedAgreements,
  Eresources,
  License,
  LicenseBusinessTerms,
  Organizations
} from './Sections';

class ViewAgreement extends React.Component {
  static manifest = Object.freeze({
    selectedAgreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
    }
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      agreementInfo: true,
      agreementLines: false,
      license: false,
      licenseBusinessTerms: false,
      organizations: false,
      eresources: false,
      associatedAgreements: false,
    }
  }

  getAgreement() {
    return get(this.props.resources.selectedAgreement, ['records', 0], {});
  }

  getSectionProps() {
    return {
      agreement: this.getAgreement(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
    }
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  renderLoadingPane() {
    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth={this.props.paneWidth}
        paneTitle="Loading..."
        dismissible
        onClose={this.props.onClose}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="100px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { stripes } = this.props;
    const agreement = this.getAgreement();

    if (!agreement) return this.renderLoadingPane();

    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth={this.props.paneWidth}
        paneTitle={agreement.name}
        dismissible
        onClose={this.props.onClose}
      >
        <AccordionSet>
          <AgreementInfo id="agreementInfo" open={this.state.sections.agreementInfo} {...sectionProps} />
          <AgreementLines id="agreementLines" open={this.state.sections.agreementLines} {...sectionProps} />
          <License id="license" open={this.state.sections.license} {...sectionProps} />
          <LicenseBusinessTerms id="licenseBusinessTerms" open={this.state.sections.licenseBusinessTerms} {...sectionProps} />
          <Organizations id="organizations" open={this.state.sections.organizations} {...sectionProps} />
          <Eresources id="eresources" open={this.state.sections.eresources} {...sectionProps} />
          <AssociatedAgreements id="associatedAgreements" open={this.state.sections.associatedAgreements} {...sectionProps} />
        </AccordionSet>
      </Pane>
    );
  }
}

export default ViewAgreement;
