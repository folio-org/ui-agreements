import React from 'react';
import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';

import {
  AgreementFormInfo,
  AgreementFormInternalContacts,
  AgreementFormLines,
  AgreementFormOrganizations,
  AgreementFormLicense,
  AgreementFormSupplementaryInfo,
} from './Sections';

import css from './AgreementForm.css';

class AgreementForm extends React.Component {
  state = {
    sections: {
      agreementFormLines: false,
      agreementFormInternalContacts: false,
      agreementFormOrganizations: false,
      agreementFormLicense: false,
      agreementFormSupplementaryInfo: false,
    }
  }

  getSectionProps() {
    return {
      agreementLines: this.props.agreementLines,
      handlers: this.props.handlers,
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
        <AgreementFormInfo {...sectionProps} />
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
            </Col>
          </Row>
          <AgreementFormInternalContacts id="agreementFormInternalContacts" open={this.state.sections.agreementFormInternalContacts} {...sectionProps} />
          <AgreementFormLines id="agreementFormLines" open={this.state.sections.agreementFormLines} {...sectionProps} />
          <AgreementFormLicense id="agreementFormLicense" open={this.state.sections.agreementFormLicense} {...sectionProps} />
          <AgreementFormOrganizations id="agreementFormOrganizations" open={this.state.sections.agreementFormOrganizations} {...sectionProps} />
          <AgreementFormSupplementaryInfo id="agreementFormSupplementaryInfo" open={this.state.sections.agreementFormSupplementaryInfo} {...sectionProps} />
        </AccordionSet>
      </div>
    );
  }
}

export default AgreementForm;
