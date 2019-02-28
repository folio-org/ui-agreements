import React from 'react';
import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';

import {
  AgreementFormInfo,
  AgreementFormEresources,
  AgreementFormOrganizations,
  AgreementFormLicense,
} from './Sections';

class AgreementForm extends React.Component {
  state = {
    sections: {
      agreementFormInfo: true,
      agreementFormEresources: false,
      agreementFormOrganizations: false,
      agreementFormLicense: false,
    }
  }

  getSectionProps() {
    return {
      agreementLines: this.props.agreementLines,
      onToggle: this.handleSectionToggle,
      parentResources: this.props.parentResources,
      parentMutator: this.props.parentMutator,
      stripes: this.props.stripes,
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

  render() {
    const sectionProps = this.getSectionProps();

    return (
      <AccordionSet>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
          </Col>
        </Row>
        <AgreementFormInfo id="agreementFormInfo" open={this.state.sections.agreementFormInfo} {...sectionProps} />
        <AgreementFormEresources id="agreementFormEresources" open={this.state.sections.agreementFormEresources} {...sectionProps} />
        <AgreementFormLicense id="agreementFormLicense" open={this.state.sections.agreementFormLicense} {...sectionProps} />
        <AgreementFormOrganizations id="agreementFormOrganizations" open={this.state.sections.agreementFormOrganizations} {...sectionProps} />
      </AccordionSet>
    );
  }
}

export default AgreementForm;
