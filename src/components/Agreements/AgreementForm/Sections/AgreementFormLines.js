import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';

import AgreementLinesFieldArray from '../components/AgreementLinesFieldArray';

export default class AgreementFormLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.object,
  };

  validateRequired = (lines = []) => {
    const unsetLines = [];
    lines.forEach((line, i) => {
      if (Object.keys(line).length === 0) {
        unsetLines.push(`#${i + 1}`);
      }
    });

    if (unsetLines.length) {
      const list = unsetLines.join(', ');
      return {
        items: <FormattedMessage id="ui-agreements.errors.unsetAgreementLines" values={{ count: unsetLines.length, list }} />
      };
    }

    return undefined;
  }

  render() {
    const { agreementLines, parentResources } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementLines" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <FieldArray
              agreementLines={agreementLines}
              component={AgreementLinesFieldArray}
              name="items"
              parentResources={parentResources}
              validate={this.validateRequired}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}
