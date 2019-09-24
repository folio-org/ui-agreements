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
  TextArea,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

class AgreementPeriodsFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  validateRequiredStartDate = (value, allValues, _props, name) => {
    if (!value) {
      if (get(allValues, name.replace('startDate', '_delete'), false) !== true) {
        return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
      }
    }

    return undefined;
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
    // Name is something like "items[3].period[2].endDate" and we want the "items[3].period" array
    const periods = get(allValues, name.substring(0, name.lastIndexOf('[')), []);
    let openEndedPeriods = 0;
    periods.forEach(c => {
      if (c.startDate && !c.endDate) openEndedPeriods += 1;
    });

    if (openEndedPeriods > 1) {
      return (
        <div data-test-error-multiple-open-ended>
          <FormattedMessage id="ui-agreements.errors.multipleOpenEndedPeriods" />
        </div>
      );
    }

    return undefined;
  }

  validateOverlappingDates = (value, allValues, _props, name) => {
    // Name is something like "items[3].period[2].endDate" and we want the "items[3].period" array
    const periods = get(allValues, name.substring(0, name.lastIndexOf('[')), []);
    const ranges = periods
      .map((c, i) => ({
        periodIndex: i,
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
          accumulator.ranges.push([current.periodIndex, previous.periodIndex]);
        }

        return accumulator;
      },
      { overlap: false, ranges: [] }
    );

    if (result.overlap) {
      return (
        <div data-test-error-overlapping-period-dates>
          <FormattedMessage
            id="ui-agreements.errors.overlappingPeriod"
            values={{ periods: result.ranges.map(r => `${r[0] + 1} & ${r[1] + 1}`).join(', ') }}
          />
        </div>
      );
    }

    return undefined;
  }

  renderPeriods = () => {
    const { items, name } = this.props;

    return items.map((period, index) => (
      <EditCard
        data-test-cc-number={index}
        header={<FormattedMessage id="ui-agreements.agreementPeriods.periodTitle" values={{ number: index + 1 }} />}
        key={index}
        onDelete={index !== 0 ? () => this.props.onDeleteField(index, period) : undefined}
      >
        <div>
          <Row>
            <Col xs={4}>
              <Field
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`period-start-date-${index}`}
                label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
                name={`${name}[${index}].startDate`}
                required
                validate={[
                  this.validateRequiredStartDate,
                  this.validateDateOrder,
                  // this.validateMultipleOpenEnded,
                  this.validateOverlappingDates,
                ]}
              />
            </Col>
            <Col xs={4}>
              <Field
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`period-end-date-${index}`}
                label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
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
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                id={`period-cancellation-deadline-${index}`}
                label={<FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />}
                name={`${name}[${index}].cancellationDeadline`}
              />
            </Col>
          </Row>
          <Field
            component={TextArea}
            id={`period-note-${index}`}
            label={<FormattedMessage id="ui-agreements.agreementPeriods.periodNote" />}
            name={`${name}[${index}].note`}
          />
        </div>
      </EditCard>
    ));
  }

  render = () => {
    return (
      <div>
        <div id="agreement-form-periods">
          { this.renderPeriods() }
        </div>
        <Button id="add-period-button" onClick={() => this.props.onAddField({})}>
          <FormattedMessage id="ui-agreements.agreementPeriods.addPeriod" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(AgreementPeriodsFieldArray);
