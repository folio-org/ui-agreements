import React from 'react';
import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';

import {
  AgreementFormInfo,
  AgreementFormLines,
  AgreementFormOrganizations,
  AgreementFormLicense,
} from './Sections';

import css from './AgreementForm.css';

class AgreementForm extends React.Component {
  state = {
    sections: {
      agreementFormInfo: true,
      agreementFormLines: false,
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
      <div className={css.agreementForm}>
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
            </Col>
          </Row>
          <AgreementFormInfo id="agreementFormInfo" open={this.state.sections.agreementFormInfo} {...sectionProps} />
          <AgreementFormLines id="agreementFormLines" open={this.state.sections.agreementFormLines} {...sectionProps} />
          <AgreementFormLicense id="agreementFormLicense" open={this.state.sections.agreementFormLicense} {...sectionProps} />
          <AgreementFormOrganizations id="agreementFormOrganizations" open={this.state.sections.agreementFormOrganizations} {...sectionProps} change={this.props.change} />
        </AccordionSet>
      </div>
    );
  }
}

export default AgreementForm;
