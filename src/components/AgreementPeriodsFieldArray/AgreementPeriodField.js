import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import get from 'lodash/get';

import {
  AppValidatedDatepicker,
  Col,
  Row,
  TextArea,
  getLocaleDateFormat
} from '@folio/stripes/components';

import { composeValidators, datePlausibilityCheck } from '@folio/stripes-erm-components';
import { validators } from '../utilities';

const multipleOpenEndedPeriods = (...rest) => (
  validators.multipleOpenEnded(...rest, 'ui-agreements.errors.multipleOpenEndedPeriods')
);

const overlappingPeriods = (...rest) => (
  validators.overlappingDates(...rest, 'ui-agreements.errors.overlappingPeriod')
);

const AgreementPeriodField = ({ index, input: { name } }) => {
  const startDateInputRef = useRef(null);
  const intl = useIntl();
  const dateFormat = getLocaleDateFormat({ intl });
  const backendDateStandard = 'YYYY-MM-DD';

  const { values } = useFormState();

  useEffect(() => {
    const startDateValue = get(values, `${name}.startDate`);
    if (startDateValue === undefined && startDateInputRef?.current) {
      startDateInputRef.current.focus();
    }
  }, [name, startDateInputRef, values]);

  return (
    <div
      data-testid="agreementPeriodField"
    >
      <Row>
        <Col xs={4}>
          <Field
            backendDateStandard={backendDateStandard}
            component={AppValidatedDatepicker}
            id={`period-start-date-${index}`}
            inputRef={startDateInputRef}
            label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
            name={`${name}.startDate`}
            required
            timeZone="UTC"
            usePortal
            validate={composeValidators(
              (value) => datePlausibilityCheck(value, dateFormat, backendDateStandard),
              validators.requiredStartDate,
              validators.dateOrder,
              overlappingPeriods,
            )}
          />
        </Col>
        <Col xs={4}>
          <Field
            backendDateStandard={backendDateStandard}
            component={AppValidatedDatepicker}
            id={`period-end-date-${index}`}
            label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
            name={`${name}.endDate`}
            parse={v => v}
            timeZone="UTC"
            usePortal
            validate={composeValidators(
              (value) => datePlausibilityCheck(value, dateFormat, backendDateStandard),
              validators.dateOrder,
              multipleOpenEndedPeriods,
              overlappingPeriods,
            )}
          />
        </Col>
        <Col xs={4}>
          <Field
            backendDateStandard={backendDateStandard}
            component={AppValidatedDatepicker}
            id={`period-cancellation-deadline-${index}`}
            label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}
            name={`${name}.cancellationDeadline`}
            parse={v => v} // Lets us send an empty string instead of `undefined`
            timeZone="UTC"
            usePortal
            validate={(value) => datePlausibilityCheck(value, dateFormat, backendDateStandard)}
          />
        </Col>
      </Row>
      <Field
        component={TextArea}
        id={`period-note-${index}`}
        label={<FormattedMessage id="ui-agreements.agreementPeriods.periodNote" />}
        name={`${name}.note`}
        parse={v => v} // Lets us send an empty string instead of `undefined`
      />
    </div>
  );
};

AgreementPeriodField.propTypes = {
  index: PropTypes.number.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AgreementPeriodField;
