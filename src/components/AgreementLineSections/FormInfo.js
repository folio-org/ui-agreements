import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Datepicker,
  Row,
  TextArea,
} from '@folio/stripes/components';

import PackageCard from '../PackageCard';
import TitleCard from '../TitleCard';

import { isPackage, parseDateOnlyString } from '../utilities';

const propTypes = {
  resource: PropTypes.object,
};

const validateDateOrder = (value, allValues, meta) => {
  let startDate;
  let endDate;

  if (!value) return undefined;

  if (meta.name === 'startDate') {
    startDate = value;
    endDate = allValues.endDate;
  } else if (meta.name === 'endDate') {
    startDate = allValues.startDate;
    endDate = value;
  } else {
    return undefined;
  }

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    return (
      <div data-test-error-end-date-too-early>
        <FormattedMessage id="ui-agreements.errors.endDateGreaterThanStartDate" />
      </div>
    );
  }

  return undefined;
};

const FormInfo = ({
  resource,
}) => (
  <>
    { isPackage(resource) ? <PackageCard pkg={resource} /> : <TitleCard title={resource} /> }
    <Row>
      <Col md={2} xs={6}>
        <Field
          backendDateStandard="YYYY-MM-DD"
          component={Datepicker}
          id="agreement-line-active-from"
          label={<FormattedMessage id="ui-agreements.eresources.activeFrom" />}
          name="startDate"
          parse={v => v} // Lets us send an empty string instead of `undefined`
          parser={parseDateOnlyString}
          validate={validateDateOrder}
        />
      </Col>
      <Col md={2} xs={6}>
        <Field
          backendDateStandard="YYYY-MM-DD"
          component={Datepicker}
          id="agreement-line-active-to"
          label={<FormattedMessage id="ui-agreements.eresources.activeTo" />}
          name="endDate"
          parse={v => v} // Lets us send an empty string instead of `undefined`
          parser={parseDateOnlyString}
          validate={validateDateOrder}
        />
      </Col>
      <Col md={8} xs={12}>
        <Field
          component={TextArea}
          id="agreement-line-note"
          label={<FormattedMessage id="ui-agreements.note" />}
          name="note"
          parse={v => v} // Lets us send an empty string instead of `undefined`
        />
      </Col>
    </Row>
  </>
);

FormInfo.propTypes = propTypes;
export default FormInfo;
