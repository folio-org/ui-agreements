import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import { validators } from '../utilities';

export default class FormInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreementStatusValues: PropTypes.array,
      renewalPriorityValues: PropTypes.array,
      isPerpetualValues: PropTypes.array,
    }),
  };

  state = {
    dataOptions: {
      agreementStatusValues: [],
      renewalPriorityValues: [],
      isPerpetualValues: [],
    }
  }

  // Prepend an empty value to each set of dropdown options to facilitate
  // unselecting a value.
  static getDerivedStateFromProps(props, state) {
    const { data } = props;
    const dataOptions = {};

    Object.keys(state.dataOptions).forEach(key => {
      if (state.dataOptions[key].length !== (data[key].length + 1)) {
        dataOptions[key] = [
          { value: null, label: '' },
          ...data[key],
        ];
      }
    });

    if (Object.keys(dataOptions).length) return { dataOptions };

    return null;
  }

  render() {
    const { dataOptions } = this.state;

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
        <Row>
          <Col xs={12} md={4}>
            <Field
              component={Select}
              dataOptions={dataOptions.agreementStatusValues}
              id="edit-agreement-status"
              label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
              name="agreementStatus"
              required
              validate={validators.required}
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              component={Select}
              dataOptions={dataOptions.renewalPriorityValues}
              id="edit-agreement-renewal-priority"
              label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}
              name="renewalPriority"
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              component={Select}
              dataOptions={dataOptions.isPerpetualValues}
              id="edit-agreement-is-perpetual"
              label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}
              name="isPerpetual"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
