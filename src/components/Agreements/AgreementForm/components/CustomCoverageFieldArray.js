import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

import EditCard from './EditCard';
import withKiwtFieldArray from './withKiwtFieldArray';

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
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                label="Start date"
                name={`${name}[${index}].startDate`}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                label="Start volume"
                name={`${name}[${index}].startVolume`}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                label="Start issue"
                name={`${name}[${index}].startIssue`}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Field
                backendDateStandard="YYYY-MM-DD"
                dateFormat="YYYY-MM-DD"
                component={Datepicker}
                label="End date"
                name={`${name}[${index}].endDate`}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                label="End volume"
                name={`${name}[${index}].endVolume`}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
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
