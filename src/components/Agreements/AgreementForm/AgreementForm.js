import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Field } from 'redux-form';
import {
  Checkbox,
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
      agreementTypeValues: PropTypes.object,
      renewalPriorityValues: PropTypes.object,
      agreementStatusValues: PropTypes.object,
      isPerpetualValues: PropTypes.object,
      contentReviewNeededValues: PropTypes.object,
    }),
  };

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
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementName' })}
                component={TextField}
                fullWidth
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
                fullWidth
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <Field
                id="startDate"
                name="startDate"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementStartDate' })}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
                fullWidth
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="endDate"
                name="endDate"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementEndDate' })}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
                fullWidth
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="cancellationDeadline"
                name="cancellationDeadline"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementCancelDeadline' })}
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
                fullWidth
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <Field
                id="agreementStatus"
                name="agreementStatus"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementStatus' })}
                component={Select}
                dataOptions={this.props.parentResources.agreementTypeValues.records}
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="renewalPriority"
                name="renewalPriority"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementRenewPrio' })}
                component={Select}
                dataOptions={[
                  { label: 'Definitely renew', value: 'renew' },
                  { label: 'For review', value: 'review' },
                  { label: 'Definitely cancel', value: 'cancel' },
                ]}
              />
            </Col>
            <Col xs={12} md={4}>
              <Field
                id="isPerpetual"
                name="isPerpetual"
                label={intl.formatMessage({ id: 'ui-erm.agreements.agreementIsPerpetual' })}
                component={Checkbox}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(AgreementForm);
