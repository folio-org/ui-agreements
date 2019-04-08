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
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}
