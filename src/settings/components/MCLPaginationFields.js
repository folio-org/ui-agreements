import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

import {
  Col,
  Layout,
  Row,
  TextField,
} from '@folio/stripes/components';

const lists = ['acquisitionOptions', 'agreementLines', 'coveredEresources', 'entitlementAgreements', 'packageContents'];

const inRange = (x, min, max) => {
  return ((x - min) * (x - max) <= 0) && Number.isInteger(x);
};

const validate = (fieldValue, min, max) => {
  return (fieldValue && !inRange(fieldValue, min, max)) ?
    <FormattedMessage id="stripes-erm-components.errors.customPropertyValueNotInRange" values={{ min, max }} /> : undefined;
};

const MCLPaginationFields = () => {
  return (
    <>
      <strong>
        <Layout className="padding-bottom-gutter padding-top-gutter" data-test-mcl-description>
          <FormattedMessage id="ui-agreements.settings.mcl.pagination.description" />
        </Layout>
        <Layout className="padding-bottom-gutter">
          <Row>
            <Col md={4} xs={12}> MCL </Col>
            <Col md={4} xs={12}> Initial load </Col>
            <Col md={4} xs={12}> Page size </Col>
          </Row>
        </Layout>
      </strong>
      { lists.map((mcl, index) => (
        <Row key={`row-${index}`}>
          <Col md={4} xs={12}>
            {mcl}
          </Col>
          <Col md={4} xs={12}>
            <Field
              component={TextField}
              id={`initialLoad-${mcl}`}
              name={`initialLoad.${mcl}`}
              normalize={v => !!v}
              validate={v => validate(v, 0, 100)}
            />
          </Col>
          <Col md={4} xs={12}>
            <Field
              component={TextField}
              id={`pageSize-${mcl}`}
              name={`pageSize.${mcl}`}
              normalize={v => !!v}
              validate={v => validate(v, 1, 100)}
            />
          </Col>
        </Row>
      ))
    }
    </>
  );
};

export default MCLPaginationFields;

