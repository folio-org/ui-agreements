import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

import { composeValidators } from '@folio/stripes-erm-components';
import { parseDateOnlyString, validators } from '../utilities';

const multipleOpenEndedCoverages = (...rest) => (
  validators.multipleOpenEnded(...rest, 'ui-agreements.errors.multipleOpenEndedCoverages')
);

const overlappingCoverages = (...rest) => (
  validators.overlappingDates(...rest, 'ui-agreements.errors.overlappingCoverage')
);

export default class CoverageField extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (!get(this.props, 'input.value.id') && get(this.inputRef, 'current')) {
      this.inputRef.current.focus();
    }
  }

  render = () => {
    const { index, input: { name } } = this.props;

    return (
      <div data-test-coverage-field>
        <Row>
          <Col md={2} xs={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              id={`cc-start-date-${index}`}
              inputRef={this.inputRef}
              label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
              name={`${name}.startDate`}
              parser={parseDateOnlyString}
              required
              usePortal
              validate={composeValidators(
                validators.requiredStartDate,
                validators.dateOrder,
                multipleOpenEndedCoverages,
                overlappingCoverages,
              )}
            />
          </Col>
          <Col md={2} xs={4}>
            <Field
              component={TextField}
              id={`cc-start-volume-${index}`}
              label={<FormattedMessage id="ui-agreements.agreementLines.customCoverage.startVolume" />}
              name={`${name}.startVolume`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
            />
          </Col>
          <Col md={2} xs={4}>
            <Field
              component={TextField}
              id={`cc-start-issue-${index}`}
              label={<FormattedMessage id="ui-agreements.agreementLines.customCoverage.startIssue" />}
              name={`${name}.startIssue`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
            />
          </Col>
          <Col md={2} xs={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              id={`cc-end-date-${index}`}
              label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
              name={`${name}.endDate`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
              parser={parseDateOnlyString}
              usePortal
              validate={composeValidators(
                validators.dateOrder,
                multipleOpenEndedCoverages,
                overlappingCoverages,
              )}
            />
          </Col>
          <Col md={2} xs={4}>
            <Field
              component={TextField}
              id={`cc-end-volume-${index}`}
              label={<FormattedMessage id="ui-agreements.agreementLines.customCoverage.endVolume" />}
              name={`${name}.endVolume`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
            />
          </Col>
          <Col md={2} xs={4}>
            <Field
              component={TextField}
              id={`cc-end-issue-${index}`}
              label={<FormattedMessage id="ui-agreements.agreementLines.customCoverage.endIssue" />}
              name={`${name}.endIssue`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
            />
          </Col>
        </Row>
      </div>
    );
  }
}
