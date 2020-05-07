import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

const propTypes = {
  line: PropTypes.shape({
    coverage: PropTypes.array,
    customCoverage: PropTypes.bool,
    endDate: PropTypes.string,
    id: PropTypes.string,
    note: PropTypes.string,
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    poLines: PropTypes.PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      titleOrPackage: PropTypes.string,
      poLineNumber: PropTypes.string,
    })),
    startDate: PropTypes.string,
  }).isRequired,
};

const Info = ({
  line,
}) => (
  <>
    <Headline size="x-large" tag="h2">
      <FormattedMessage id="ui-agreements.line.lineInformation" />
    </Headline>
    <KeyValue label={<FormattedMessage id="ui-agreements.line.parentAgreement" />}>
      <div data-test-agreement-line-agreement>
        {line.owner?.name ?? <NoValue />}
      </div>
    </KeyValue>
    <Row>
      <Col md={3} xs={6}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.activeFrom" />}>
          <div data-test-agreement-line-active-from>
            {line.startDate ?? <NoValue />}
          </div>
        </KeyValue>
      </Col>
      <Col md={3} xs={6}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.activeTo" />}>
          <div data-test-agreement-line-active-to>
            {line.endDate ?? <NoValue />}
          </div>
        </KeyValue>
      </Col>
      <Col md={6} xs={12}>
        <KeyValue label={<FormattedMessage id="ui-agreements.note" />}>
          <div data-test-agreement-line-note>
            {line.note ?? <NoValue />}
          </div>
        </KeyValue>
      </Col>
    </Row>
  </>
);

Info.propTypes = propTypes;
export default Info;
