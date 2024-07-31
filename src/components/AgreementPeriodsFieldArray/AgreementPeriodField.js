import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import dayjs from 'dayjs';

import {
  Col,
  Datepicker,
  Row,
  TextArea,
  getLocaleDateFormat
} from '@folio/stripes/components';

import { composeValidators } from '@folio/stripes-erm-components';
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

  useEffect(() => {
    const value = get(startDateInputRef, 'current.value');
    if ((value === '' || value === undefined) && get(startDateInputRef, 'current')) {
      startDateInputRef.current.focus();
    }
  }, [startDateInputRef]);

  const handleDateChange = (event, input) => {
    const dateValue = event.target.value;
    input.onChange(dateValue);
  };

  const parseDate = (value) => {
    // If value is not a valid date according to the locale format, return it as-is
    // (important for letting the user type a date)
    if (!dayjs(value, dateFormat, true).isValid()) {
      return value;
    }
    // Otherwise, return the value formatted in the backend standard (important for submitting)
    return dayjs(value, dateFormat).format(backendDateStandard);
  };

  return (
    <div data-testid="agreementPeriodField">
      <Row>
        <Col xs={4}>
          <Field
            name={`${name}.startDate`}
            parse={parseDate}
            validate={composeValidators(
              (value) => validators.datePlausibilityCheck(value, dateFormat, backendDateStandard),
              validators.requiredStartDate,
              validators.dateOrder,
              overlappingPeriods,
            )}
          >
            {({ input, meta }) => (
              <Datepicker
                {...input}
                backendDateStandard={backendDateStandard}
                dateFormat={dateFormat}
                error={meta.touched && meta.error ? meta.error : ''}
                id={`period-start-date-${index}`}
                inputRef={startDateInputRef}
                label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
                onChange={event => handleDateChange(event, input)}
                timeZone="UTC"
                usePortal
              />
            )}
          </Field>
        </Col>
        <Col xs={4}>
          <Field
            name={`${name}.endDate`}
            parse={parseDate}
            validate={composeValidators(
              (value) => validators.datePlausibilityCheck(value, dateFormat, backendDateStandard),
              validators.dateOrder,
              multipleOpenEndedPeriods,
              overlappingPeriods,
            )}
          >
            {({ input, meta }) => (
              <Datepicker
                {...input}
                backendDateStandard={backendDateStandard}
                dateFormat={dateFormat}
                error={meta.touched && meta.error ? meta.error : ''}
                id={`period-end-date-${index}`}
                label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
                onChange={event => handleDateChange(event, input)}
                timeZone="UTC"
                usePortal
              />
            )}
          </Field>
        </Col>
        <Col xs={4}>
          <Field
            name={`${name}.cancellationDeadline`}
            parse={parseDate}
            validate={(value) => validators.datePlausibilityCheck(value, dateFormat, backendDateStandard)}
          >
            {({ input, meta }) => (
              <Datepicker
                {...input}
                backendDateStandard={backendDateStandard}
                dateFormat={dateFormat}
                error={meta.touched && meta.error ? meta.error : ''}
                id={`period-cancellation-deadline-${index}`}
                label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}
                onChange={event => handleDateChange(event, input)}
                timeZone="UTC"
                usePortal
              />
            )}
          </Field>
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
