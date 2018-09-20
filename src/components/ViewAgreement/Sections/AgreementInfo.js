import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes-components';

import css from './AgreementInfo.css';

class AgreementInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      internalContacts: false,
      contentReviews: false,
      trials: false,
      reviewHistory: false,
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

  render() {
    const { agreement, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.agreements.agreementInfo' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.agreementName' })}
              value={agreement.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.agreementDescription' })}
              value={agreement.description}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.agreementCancelDeadline' })}
              value={agreement.cancellationDeadline ? intl.formatDate(agreement.cancellationDeadline) : '-'}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.agreementRenewPrio' })}
              value={get(agreement, ['renewalPriority', 'label'], '-')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.agreementStatus' })}
              value={get(agreement, ['agreementStatus', 'label'], '-')}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.agreementIsPerpetual' })}
              value={get(agreement, ['isPerpetual', 'label'], '-')}
            />
          </Col>
        </Row>
        <Row className={css.agreementInfoSections}>
          <Col xs={12}>
            <AccordionSet>
              <Accordion
                id="internalContacts"
                label={intl.formatMessage({ id: 'ui-erm.agreements.internalContacts' })}
                onToggle={this.handleSectionToggle}
                open={this.state.sections.internalContacts}
              >
                -
              </Accordion>
              <Accordion
                id="contentReviews"
                label={intl.formatMessage({ id: 'ui-erm.agreements.contentReviews' })}
                onToggle={this.handleSectionToggle}
                open={this.state.sections.contentReviews}
              >
                -
              </Accordion>
              <Accordion
                id="trials"
                label={intl.formatMessage({ id: 'ui-erm.agreements.trials' })}
                onToggle={this.handleSectionToggle}
                open={this.state.sections.trials}
              >
                -
              </Accordion>
              <Accordion
                id="reviewHistory"
                label={intl.formatMessage({ id: 'ui-erm.agreements.reviewHistory' })}
                onToggle={this.handleSectionToggle}
                open={this.state.sections.reviewHistory}
              >
                -
              </Accordion>
            </AccordionSet>
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default AgreementInfo;
