import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import InternalContacts from './InternalContacts';
import css from './AgreementInfo.css';

export default class AgreementInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    parentMutator: PropTypes.object,
    parentResources: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { agreement } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.name" />}>
                <div data-test-agreement-name>
                  {agreement.name}
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}>
                <div data-test-agreement-description>
                  {agreement.description}
                </div>
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}>
                <div data-test-agreement-cancellation-deadline>
                  {agreement.cancellationDeadline ? <FormattedDate value={agreement.cancellationDeadline} /> : '-'}
                </div>
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}>
                <div data-test-agreement-renewal-priority>
                  {get(agreement, ['renewalPriority', 'label'], '-')}
                </div>
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}>
                <div data-test-agreement-is-perpetual>
                  {get(agreement, ['isPerpetual', 'label'], '-')}
                </div>
              </KeyValue>
            </Col>
          </Row>
        </React.Fragment>
        <Row className={css.agreementInfoSections}>
          <Col xs={12}>
            <AccordionSet>
              <InternalContacts key={agreement.id} {...this.props} />
              <Accordion closedByDefault label={<FormattedMessage id="ui-agreements.agreements.contentReviews" />}>-</Accordion>
              <Accordion closedByDefault label={<FormattedMessage id="ui-agreements.agreements.trials" />}>-</Accordion>
              <Accordion closedByDefault label={<FormattedMessage id="ui-agreements.agreements.reviewHistory" />}>-</Accordion>
            </AccordionSet>
          </Col>
        </Row>
      </Accordion>
    );
  }
}
