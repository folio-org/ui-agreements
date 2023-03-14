import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';
import { useStripes } from '@folio/stripes/core';
import {
  Col,
  Layout,
  Row,
  TextField,
} from '@folio/stripes/components';

import { defaultMclPageSize } from '../../../constants';

const mclList = Object.keys(defaultMclPageSize.pageSize);
const MIN_RANGE = 1;
const MAX_RANGE = 100;

const validate = (fieldValue, min, max) => {
  const fieldValueInt = (typeof fieldValue !== 'number' ? parseInt(fieldValue, 10) : fieldValue);
  return (!fieldValue || fieldValueInt >= max || fieldValueInt < min) ?
    <FormattedMessage id="ui-agreements.settings.error.valueNotInRange" values={{ min, max }} /> : undefined;
};

const MCLPaginationFields = () => {
  const stripes = useStripes();
  const disabled = !stripes.hasPerm('ui-agreements.generalSettings.manage');
  return (
    <>
      <Layout className="padding-bottom-gutter padding-top-gutter" data-test-mcl-description>
        <FormattedMessage id="ui-agreements.settings.tabularList.pagination" />
      </Layout>
      <Layout className="padding-bottom-gutter">
        <Row>
          <Col xs={8}> <FormattedMessage id="ui-agreements.settings.tabularList" /> </Col>
          <Col xs={4}> <FormattedMessage id="ui-agreements.settings.mcl.pageSize" /> </Col>
        </Row>
      </Layout>
      {mclList.map((mcl, index) => (
        <Row key={index}>
          <Col
            id={`pageSize-${mcl}-col`}
            xs={8}
          >
            <FormattedMessage id={`ui-agreements.settings.mcl.${mcl}`} />
          </Col>
          <Col xs={4}>
            <Field
              ariaLabel={`${mcl}-page-size`}
              component={TextField}
              data-testid={`${mcl}-page-size-testId`}
              disabled={disabled}
              id={`${mcl}-page-size-id`}
              name={`pageSize.${mcl}`}
              parse={v => parseInt(v, 10)}
              type="number"
              validate={v => validate(v, MIN_RANGE, MAX_RANGE)}
            />
          </Col>
        </Row>
      ))
      }
    </>
  );
};

export default MCLPaginationFields;

