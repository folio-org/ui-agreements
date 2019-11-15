import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import AgreementPeriodsFieldArray from '../AgreementPeriodsFieldArray';
import { validators } from '../utilities';
import { statuses } from '../../constants';

export default class FormInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreementStatusValues: PropTypes.array,
      reasonForClosureValues: PropTypes.array,
      renewalPriorityValues: PropTypes.array,
      isPerpetualValues: PropTypes.array,
    }),
    form: PropTypes.shape({
      mutators: PropTypes.shape({
        setFieldData: PropTypes.func.isRequired,
      }).isRequired,
    }),
    values: PropTypes.object,
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

    if (data.agreementStatusValues.length !== state.agreementStatusValues.length) {
      newState.agreementStatusValues = data.agreementStatusValues;
    }

    if (data.renewalPriorityValues.length + 1 !== state.renewalPriorityValues.length) {
      newState.renewalPriorityValues = [{ value: '', label: '' }, ...data.renewalPriorityValues];
    }

    if (data.isPerpetualValues.length + 1 !== state.isPerpetualValues.length) {
      newState.isPerpetualValues = [{ value: '', label: '' }, ...data.isPerpetualValues];
    }

    if (data.reasonForClosureValues.length + 1 !== state.reasonForClosureValues.length) {
      newState.reasonForClosureValues = [{ value: '', label: '' }, ...data.reasonForClosureValues];
    }

    if (Object.keys(newState).length) return newState;

    return null;
  }

  render() {
    const { agreementStatusValues, isPerpetualValues, renewalPriorityValues, reasonForClosureValues } = this.state;
    const { values } = this.props;

    return (
      <div data-test-edit-agreement-info>
        <Row>
          <Col xs={12}>
            <Field
              component={TextField}
              id="edit-agreement-name"
              label={<FormattedMessage id="ui-agreements.agreements.name" />}
              maxLength={255}
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
              parse={v => v} // Lets us send an empty string instead of `undefined`
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Field name="agreementStatus" validate={validators.required}>
              {props => {
                return (<Select
                  dataOptions={agreementStatusValues}
                  id="edit-agreement-status"
                  label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
                  placeholder=" "
                  onChange={(e) => {
                    props.input.onChange(e);

                    let warning;

                    if (values.reasonForClosure && e.target.value !== statuses.CLOSED) {
                      warning = (
                        <div data-test-warn-clear-reason-for-closure>
                          <FormattedMessage id="ui-agreements.warn.clearReasonForClosure" />
                        </div>
                      );
                    }

                    this.props.form.mutators.setFieldData('reasonForClosure', { warning });
                  }}
                  required
                  value={props.input.value}
                />);
              }}
            </Field>
          </Col>
          <Col xs={12} md={6}>
            <Field
              component={Select}
              dataOptions={reasonForClosureValues}
              disabled={values.agreementStatus !== statuses.CLOSED}
              id="edit-agreement-reason-for-closure"
              label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}
              name="reasonForClosure"
              parse={v => v} // Lets us send an empty string instead of `undefined`
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
              parse={v => v} // Lets us pass an empty string instead of `undefined`
            />
          </Col>
          <Col xs={12} md={6}>
            <Field
              component={Select}
              dataOptions={isPerpetualValues}
              id="edit-agreement-is-perpetual"
              label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}
              name="isPerpetual"
              parse={v => v} // Lets us pass an empty string instead of `undefined`
            />
          </Col>
        </Row>
        <FieldArray
          component={AgreementPeriodsFieldArray}
          name="periods"
        />
      </div>
    );
  }
}
