import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import {
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import { validators } from '../utilities';

class FormInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreementStatusValues: PropTypes.array,
      reasonForClosureValues: PropTypes.array,
      renewalPriorityValues: PropTypes.array,
      isPerpetualValues: PropTypes.array,
    }),
  };

  state = {
    agreementStatusValues: [],
    reasonForClosureValues: [],
    isPerpetualValues: [],
    renewalPriorityValues: [],
  }

  // Prepend an empty value to each set of dropdown options to facilitate
  // unselecting a value.
  static getDerivedStateFromProps(props, state) {
    const { data } = props;
    const newState = {};
    //console.log("data state: %o", data)
    if (data.agreementStatusValues.length !== state.agreementStatusValues.length) {
      newState.agreementStatusValues = data.agreementStatusValues;
      /* if (data.agreementStatus.value === 'closed') {
        newState.agreementIsOpen = false;
      } */
    }

    if (data.renewalPriorityValues.length + 1 !== state.renewalPriorityValues.length) {
      newState.renewalPriorityValues = [{ value: null, label: '' }, ...data.renewalPriorityValues];
    }

    if (data.isPerpetualValues.length + 1 !== state.isPerpetualValues.length) {
      newState.isPerpetualValues = [{ value: null, label: '' }, ...data.isPerpetualValues];
    }

    if (data.reasonForClosureValues.length + 1 !== state.reasonForClosureValues.length) {
      newState.reasonForClosureValues = [{ value: null, label: '' }, ...data.reasonForClosureValues];
    }

    if (Object.keys(newState).length) return newState;

    return null;
  }

  render() {
    const { agreementStatusValues, isPerpetualValues, renewalPriorityValues, reasonForClosureValues} = this.state;
    return (
      <div data-test-edit-agreement-info>
        <Row>
          <Col xs={12}>
            <Field
              component={TextField}
              id="edit-agreement-name"
              label={<FormattedMessage id="ui-agreements.agreements.name" />}
              name="name"
              required
              validate={validators.required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={TextArea}
              id="edit-agreement-description"
              label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}
              name="description"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Field
              component={Select}
              dataOptions={agreementStatusValues}
              id="edit-agreement-status"
              label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
              name="agreementStatus"
              placeholder=" "
              required
              validate={validators.required}
            />
          </Col>
          <Col xs={12} md={6}>
            <Field
              component={Select}
              dataOptions={reasonForClosureValues}
              disabled={this.props.statusValue !== 'closed'}
              id="edit-agreement-reason-for-closure"
              label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}
              name="reasonForClosure"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Field
              component={Select}
              dataOptions={renewalPriorityValues}
              id="edit-agreement-renewal-priority"
              label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}
              name="renewalPriority"
            />
          </Col>
          <Col xs={12} md={6}>
            <Field
              component={Select}
              dataOptions={isPerpetualValues}
              id="edit-agreement-is-perpetual"
              label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}
              name="isPerpetual"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              id="edit-agreement-start-date"
              label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
              name="startDate"
              required
              validate={validators.required}
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              id="edit-agreement-end-date"
              label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
              name="endDate"
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              id="edit-agreement-cancellation-deadline"
              label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}
              name="cancellationDeadline"
            />
          </Col>
        </Row>
      </div>
    );
  };
}

FormInfo = reduxForm({
  form: 'agreementFormInfo'
})(FormInfo)

const selector = formValueSelector('agreementFormInfo')
FormInfo = connect(state => {
  const statusValue = selector(state, 'agreementStatus')
  return {
    statusValue,
  }
})(FormInfo)

export default FormInfo