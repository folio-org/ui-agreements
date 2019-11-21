import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Datepicker,
  Headline,
  Row,
  TextArea,
} from '@folio/stripes/components';

import { composeValidators, EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import { validators } from '../utilities';

const multipleOpenEndedPeriods = (...rest) => (
  validators.multipleOpenEnded(...rest, 'ui-agreements.errors.multipleOpenEndedPeriods')
);

const overlappingPeriods = (...rest) => (
  validators.overlappingDates(...rest, 'ui-agreements.errors.overlappingPeriod')
);

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

  renderPeriods = () => {
    const { items, name } = this.props;

    return items.map((period, index) => (
      <EditCard
        data-test-cc-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.agreementPeriods.removePeriod" />}
        header={<FormattedMessage id="ui-agreements.agreementPeriods.periodTitle" values={{ number: index + 1 }} />}
        key={index}
        onDelete={index !== 0 ? () => this.props.onDeleteField(index, period) : undefined}
        hasMargin
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
                validate={composeValidators(
                  validators.requiredStartDate,
                  validators.dateOrder,
                  overlappingPeriods,
                )}
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
                parse={v => v} // Lets us send an empty string instead of `undefined`
                validate={composeValidators(
                  validators.dateOrder,
                  multipleOpenEndedPeriods,
                  overlappingPeriods,
                )}
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
                parse={v => v} // Lets us send an empty string instead of `undefined`
              />
            </Col>
          </Row>
          <Field
            component={TextArea}
            id={`period-note-${index}`}
            label={<FormattedMessage id="ui-agreements.agreementPeriods.periodNote" />}
            name={`${name}[${index}].note`}
            parse={v => v} // Lets us send an empty string instead of `undefined`
          />
        </div>
      </EditCard>
    ));
  }

  render = () => {
    return (
      <div>
        <Headline>
          <FormattedMessage id="ui-agreements.agreementPeriods" />
        </Headline>
        <div id="agreement-form-periods">
          {this.renderPeriods()}
        </div>
        <Button id="add-period-button" onClick={() => this.props.onAddField()}>
          <FormattedMessage id="ui-agreements.agreementPeriods.addPeriod" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(AgreementPeriodsFieldArray);
