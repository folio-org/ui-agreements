import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { get } from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './AgreementInfo.css';

class AgreementInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    intl: intlShape,
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
    const { agreement, intl } = this.props;

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
              label={intl.formatMessage({ id: 'ui-erm.agreements.name' })}
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
          <Col xs={4}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.cancellationDeadline' })}
              value={agreement.cancellationDeadline ? intl.formatDate(agreement.cancellationDeadline) : '-'}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.renewalPriority' })}
              value={get(agreement, ['renewalPriority', 'label'], '-')}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.agreements.isPerpetual' })}
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
                {
                  Array.isArray(agreement.contacts) &&
                  agreement.contacts.map(contact => (
                    <span key={Math.random()}>
                      {contact.id}: {contact.role}
                    </span>
                  ))
                }
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

export default injectIntl(AgreementInfo);
