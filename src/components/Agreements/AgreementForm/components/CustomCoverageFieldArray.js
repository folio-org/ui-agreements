import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import EditCard from './EditCard';
import { required } from '../../../../util/validators';

class CustomCoverageFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  validateDateOrder = (value, allValues, _props, name) => {
    if (value) {
      let startDate;
      let endDate;

      if (name.indexOf('startDate') >= 0) {
        startDate = new Date(value);
        endDate = new Date(get(allValues, name.replace('startDate', 'endDate')));
      } else if (name.indexOf('endDate') >= 0) {
        startDate = new Date(get(allValues, name.replace('endDate', 'startDate')));
        endDate = new Date(value);
      } else {
        return undefined;
      }

      if (startDate >= endDate) {
        return (
          <div data-test-error-end-date-too-early>
            <FormattedMessage id="ui-agreements.errors.endDateGreaterThanStartDate" />
          </div>
        );
      }
    }

    return undefined;
  }

  validateMultipleOpenEnded = (_value, allValues, _props, name) => {
    // Name is something like "items[3].coverage[2].endDate" and we want the "items[3].coverage" array
    const coverages = get(allValues, name.substring(0, name.lastIndexOf('[')), []);
    let openEndedCoverages = 0;
    coverages.forEach(c => {
      if (c.startDate && !c.endDate) openEndedCoverages += 1;
    });

    if (openEndedCoverages > 1) {
      return (
        <div data-test-error-multiple-open-ended>
          <FormattedMessage id="ui-agreements.errors.multipleOpenEndedCoverages" />
        </div>
      );
    }

    return undefined;
  }

  validateOverlappingDates = (value, allValues, _props, name) => {
    // Name is something like "items[3].coverage[2].endDate" and we want the "items[3].coverage" array
    const coverages = get(allValues, name.substring(0, name.lastIndexOf('[')), []);
    const ranges = coverages
      .map((c, i) => ({
        coverageIndex: i,
        startDate: new Date(c.startDate),
        endDate: c.endDate ? new Date(c.endDate) : new Date('4000-01-01'),
      }))
      .sort((a, b) => (a.startDate.getTime() < b.startDate.getTime() ? -1 : 1));

    const result = ranges.reduce(
      (accumulator, current, i, a) => {
        if (i === 0) return accumulator;

        const previous = a[i - 1];

        const overlap = previous.endDate.getTime() >= current.startDate.getTime();

        if (overlap) {
          accumulator.overlap = true;
          accumulator.ranges.push([current.coverageIndex, previous.coverageIndex]);
        }

        return accumulator;
      },
      { overlap: false, ranges: [] }
    );

    if (result.overlap) {
      return (
        <div data-test-error-overlapping-coverage-dates>
          <FormattedMessage
            id="ui-agreements.errors.overlappingCoverage"
            values={{ coverages: result.ranges.map(r => `${r[0] + 1} & ${r[1] + 1}`).join(', ') }}
          />
        </div>
      );
    }

    return undefined;
  }

  handleAddCustomCoverage = () => {
    this.props.onAddField({});
  }

  renderCustomCoverages = () => {
    const { items, name } = this.props;

    return items.map((coverage, index) => (
      <EditCard
        data-test-cc-number={index}
        header={<FormattedMessage id="ui-agreements.agreementLines.customCoverageTitle" values={{ number: index + 1 }} />}
        key={index}
        onDelete={() => this.props.onDeleteField(index, coverage)}
      >
        <div>
          <Row>
            <Col xs={4}>
              <Field
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`cc-start-date-${index}`}
                label="Start date"
                name={`${name}[${index}].startDate`}
                required
                validate={[
                  required,
                  this.validateDateOrder,
                  this.validateMultipleOpenEnded,
                  this.validateOverlappingDates,
                ]}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-start-volume-${index}`}
                label="Start volume"
                name={`${name}[${index}].startVolume`}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-start-issue-${index}`}
                label="Start issue"
                name={`${name}[${index}].startIssue`}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Field
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`cc-end-date-${index}`}
                label="End date"
                name={`${name}[${index}].endDate`}
                validate={[
                  this.validateDateOrder,
                  this.validateMultipleOpenEnded,
                  this.validateOverlappingDates,
                ]}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-end-volume-${index}`}
                label="End volume"
                name={`${name}[${index}].endVolume`}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                id={`cc-end-issue-${index}`}
                label="End issue"
                name={`${name}[${index}].endIssue`}
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
          { this.renderCustomCoverages() }
        </div>
        <Button id="add-agreement-custom-coverage-button" onClick={this.handleAddCustomCoverage}>
          <FormattedMessage id="ui-agreements.agreementLines.addCustomCoverage" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(CustomCoverageFieldArray);
