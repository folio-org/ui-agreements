import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';

import {
  AgreementFormInfo,
  AgreementFormEresources
} from './Sections';

class AgreementForm extends React.Component {
  static propTypes = {
    intl: intlShape,
  };

  state = {
    sections: {
      agreementFormInfo: true,
      agreementFormEresources: true,
    }
  }

  getSectionProps() {
    return {
      onToggle: this.handleSectionToggle,
      ...this.props,
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
      </AccordionSet>
    );
  }
}

export default injectIntl(AgreementForm);
