import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { OnChange } from 'react-final-form-listeners'

import {
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import AgreementPeriodsFieldArray from '../AgreementPeriodsFieldArray';
import { validators } from '../utilities';

export default class FormInfo extends React.Component {
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
    isClosed: false
  }

  // Prepend an empty value to each set of dropdown options to facilitate
  // unselecting a value.
  static getDerivedStateFromProps(props, state) {
    const { data } = props;
    const newState = {};

    if (data.agreementStatusValues.length !== state.agreementStatusValues.length) {
      newState.agreementStatusValues = data.agreementStatusValues;
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
    const { agreementStatusValues, isPerpetualValues, renewalPriorityValues, reasonForClosureValues } = this.state;
    const {form: {mutators}} = this.props;
    var reasonIsEmpty = true;

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
              disabled={!this.state.isClosed}
              id="edit-agreement-reason-for-closure"
              label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}
              name="reasonForClosure"
              placeholder=" "
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
        <FieldArray
          component={AgreementPeriodsFieldArray}
          name="periods"
        />
        <OnChange>
          {(values, previous) => {
            //Check if status is closed and, if so, change state to allow reasonForClosure field
            if (values.agreementStatus === 'closed') {
              this.setState({isClosed: true})
            }
            else {
              this.setState({isClosed: false})
              }
            if (values.reasonForClosure) {
              reasonIsEmpty = false
            }
            else {
              reasonIsEmpty = true
            }
            if (values.reasonForClosure && values.agreementStatus !== 'closed') {
              mutators.setFieldData('reasonForClosure', {
                warning: (
                  <div data-test-warn-clear-reason-for-closure>
                    <FormattedMessage id="ui-agreements.warn.clearReasonForClosure" />
                  </div>
                )
              });
            }}
          }
        </OnChange>
      </div>
    );
  }
}
