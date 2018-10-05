import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Field } from 'redux-form';
import { get } from 'lodash';
import {
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes-components';

class AgreementForm extends React.Component {
  static propTypes = {
    intl: intlShape,
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

  render() {
    const { intl } = this.props;

    return (
      <Row>
        <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
          <Row>
            <Col xs={12}>
              <Field
                id="name"
                name="name"
                label={`${intl.formatMessage({ id: 'ui-erm.agreements.name' })} *`}
                component={TextField}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Field
                id="description"
                name="description"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementDescription' })}
                component={TextArea}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <Field
                id="startDate"
                name="startDate"
                label={`${intl.formatMessage({ id: 'ui-erm.agreements.startDate' })} *`}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="endDate"
                name="endDate"
                label={intl.formatMessage({ id: 'ui-erm.agreements.endDate' })}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="cancellationDeadline"
                name="cancellationDeadline"
                label={intl.formatMessage({ id: 'ui-erm.agreements.cancellationDeadline' })}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <Field
                id="agreementStatus"
                name="agreementStatus"
                label={`${intl.formatMessage({ id: 'ui-erm.agreements.agreementStatus' })} *`}
                component={Select}
                dataOptions={this.getAgreementStatusValues()}
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="renewalPriority"
                name="renewalPriority"
                label={intl.formatMessage({ id: 'ui-erm.agreements.renewalPriority' })}
                component={Select}
                dataOptions={this.getRenewalPriorityValues()}
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="isPerpetual"
                name="isPerpetual"
                label={intl.formatMessage({ id: 'ui-erm.agreements.isPerpetual' })}
                component={Select}
                dataOptions={this.getIsPerpetualValues()}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(AgreementForm);
