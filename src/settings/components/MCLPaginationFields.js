import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form-html5-validation';

import {
  Col,
  Layout,
  Row,
  TextField,
} from '@folio/stripes/components';

const lists = ['agreementLines', 'agreementEresources', 'entitlementOptions', 'packageContents', 'entitlements'];

const inRange = (x, min, max) => {
  return ((x - min) * (x - max) <= 0);
};

const validate = (fieldValue, min, max) => {
  return (!inRange(fieldValue, min, max)) ?
    <FormattedMessage id="ui-agreements.settings.error.valueNotInRange" values={{ min, max }} /> : undefined;
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
            <Col xs={6}> <FormattedMessage id="ui-agreements.settings.mcl" /> </Col>
            {/* <Col xs={3}> <FormattedMessage id="ui-agreements.settings.mcl.initialLoad" /> </Col> */}
            <Col xs={3}> <FormattedMessage id="ui-agreements.settings.mcl.pageSize" /> </Col>
          </Row>
        </Layout>
      </strong>
      { lists.map((mcl, index) => (
        <Row key={`row-${index}`}>
          <Col xs={6}>
            <FormattedMessage id={`ui-agreements.settings.mcl.${mcl}`} />
          </Col>
          {/* <Col xs={3}>
            <Field
              component={TextField}
              id={`initialLoad-${mcl}`}
              name={`initialLoad.${mcl}`}
              parse={v => parseInt(v, 10)}
              type="number"
              validate={v => validate(v, 0, 100)}
            />
          </Col> */}
          <Col xs={3}>
            <Field
              component={TextField}
              id={`pageSize-${mcl}`}
              name={`pageSize.${mcl}`}
              parse={v => parseInt(v, 10)}
              type="number"
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

