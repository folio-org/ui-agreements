import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

import { composeValidators, EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import { validators } from '../utilities';

const multipleOpenEndedCoverages = (...rest) => (
  validators.multipleOpenEnded(...rest, 'ui-agreements.errors.multipleOpenEndedCoverages')
);

const overlappingCoverages = (...rest) => (
  validators.overlappingDates(...rest, 'ui-agreements.errors.overlappingCoverage')
);

class CustomCoverageFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  }

  renderCustomCoverages = () => {
    const { items, name } = this.props;

    return items.map((coverage, index) => (
      <EditCard
        data-test-cc-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.agreementLines.removeCustomCoverage" />}
        header={<FormattedMessage id="ui-agreements.agreementLines.customCoverageTitle" values={{ number: index + 1 }} />}
        key={index}
        onDelete={() => this.props.onDeleteField(index, coverage)}
        hasMargin
      >
        <div>
          <Row>
            <Col xs={4}>
              <Field
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`cc-start-date-${index}`}
                label="Start date"
                name={`${name}[${index}].startDate`}
                required
                validate={composeValidators(
                  validators.requiredStartDate,
                  validators.dateOrder,
                  multipleOpenEndedCoverages,
                  overlappingCoverages,
                )}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-start-volume-${index}`}
                label="Start volume"
                name={`${name}[${index}].startVolume`}
                parse={v => v} // Lets us send an empty string instead of `undefined`
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-start-issue-${index}`}
                label="Start issue"
                name={`${name}[${index}].startIssue`}
                parse={v => v} // Lets us send an empty string instead of `undefined`
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Field
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`cc-end-date-${index}`}
                label="End date"
                name={`${name}[${index}].endDate`}
                parse={v => v} // Lets us send an empty string instead of `undefined`
                validate={composeValidators(
                  validators.dateOrder,
                  multipleOpenEndedCoverages,
                  overlappingCoverages,
                )}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-end-volume-${index}`}
                label="End volume"
                name={`${name}[${index}].endVolume`}
                parse={v => v} // Lets us send an empty string instead of `undefined`
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-end-issue-${index}`}
                label="End issue"
                name={`${name}[${index}].endIssue`}
                parse={v => v} // Lets us send an empty string instead of `undefined`
              />
            </Col>
          </Row>
        </div>
      </EditCard>
    ));
  }

  render = () => {
    return (
      <div>
        <div id="agreement-form-custom-coverages">
          {this.renderCustomCoverages()}
        </div>
        <Button id="add-agreement-custom-coverage-button" onClick={() => this.props.onAddField()}>
          <FormattedMessage id="ui-agreements.agreementLines.addCustomCoverage" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(CustomCoverageFieldArray);
