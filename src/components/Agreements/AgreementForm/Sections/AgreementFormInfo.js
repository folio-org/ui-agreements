import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'redux-form';

import {
  Accordion,
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import AgreementFormInternalContacts from './AgreementFormInternalContacts';
import { required } from '../../../../util/validators';

class AgreementFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      agreementStatusValues: PropTypes.object,
      renewalPriorityValues: PropTypes.object,
      isPerpetualValues: PropTypes.object,
    }),
  };

  getAgreementStatusValues() {
    return get(this.props.parentResources.agreementStatusValues, ['records'], [])
      .map(value => ({ label: value.label, value: value.id }));
  }

  getRenewalPriorityValues() {
    const values = get(this.props.parentResources.renewalPriorityValues, ['records'], [])
      .map(value => ({ label: value.label, value: value.id }));

    values.unshift({ label: '', value: null });

    return values;
  }

  getIsPerpetualValues() {
    const values = get(this.props.parentResources.isPerpetualValues, ['records'], [])
      .map(value => ({ label: value.label, value: value.id }));

    values.unshift({ label: '', value: null });

    return values;
  }

  getSectionProps() {
    return {
      parentMutator: this.props.parentMutator,
      parentResources: this.props.parentResources,
    };
  }

  render() {
    const sectionProps = this.getSectionProps();

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <Field
              id="edit-agreement-name"
              name="name"
              label={<FormattedMessage id="ui-agreements.agreements.name" />}
              component={TextField}
              validate={required}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              id="edit-agreement-description"
              name="description"
              label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}
              component={TextArea}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Field
              id="edit-agreement-start-date"
              name="startDate"
              label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              validate={required}
              required
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              id="edit-agreement-end-date"
              name="endDate"
              label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              id="edit-agreement-cancellation-deadline"
              name="cancellationDeadline"
              label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <FormattedMessage id="ui-agreements.agreements.selectStatus">
              {placeholder => (
                <Field
                  id="edit-agreement-status"
                  component={Select}
                  dataOptions={this.getAgreementStatusValues()}
                  name="agreementStatus"
                  label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
                  placeholder={placeholder}
                  required
                  validate={required}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={12} md={4}>
            <Field
              id="edit-agreement-renewal-priority"
              name="renewalPriority"
              label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}
              component={Select}
              dataOptions={this.getRenewalPriorityValues()}
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              id="edit-agreement-is-perpetual"
              name="isPerpetual"
              label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}
              component={Select}
              dataOptions={this.getIsPerpetualValues()}
            />
          </Col>
        </Row>
        <div style={{ marginLeft: '2rem' }}>
          <AgreementFormInternalContacts {...sectionProps} />
        </div>
      </Accordion>
    );
  }
}

export default AgreementFormInfo;
