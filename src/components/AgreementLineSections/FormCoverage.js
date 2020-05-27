import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Accordion, Col, KeyValue, Layout, Row } from '@folio/stripes/components';

import { SerialCoverage } from '../Coverage';
import CoverageFieldArray from '../CoverageFieldArray';
import { isExternal, isPackage } from '../utilities';

const propTypes = {
  line: PropTypes.object,
  resource: PropTypes.object,
};

const FormCoverage = ({
  line,
  resource,
}) => {
  if (isExternal(line)) return null;
  if (isPackage(resource)) return null;

  return (
    <Accordion
      id="agreement-line-form-coverage"
      label={<FormattedMessage id="ui-agreements.eresources.coverage" />}
    >
      <Row>
        <Col xs={4}>
          <KeyValue
            label={(
              <Layout className="textCentered">
                <FormattedMessage id="ui-agreements.eresources.defaultCoverage" />
              </Layout>
            )}
          >
            {/* This is intentional, after talking to Gill a decision was made that behaviour
                of coverage in the edit screen was to remain blank for monographs. */}
            <SerialCoverage statements={resource.coverage} />
          </KeyValue>
        </Col>
      </Row>
      <FieldArray
        addButtonId="add-agreement-line-custom-coverage-button"
        addLabelId="ui-agreements.agreementLines.addCustomCoverage"
        component={CoverageFieldArray}
        deleteButtonTooltipId="ui-agreements.agreementLines.removeCustomCoverage"
        headerId="ui-agreements.agreementLines.customCoverageTitle"
        id="agreement-line-form-custom-coverages"
        name="coverage"
      />
    </Accordion>
  );
};

FormCoverage.propTypes = propTypes;
export default FormCoverage;
