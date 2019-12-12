import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button } from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import CustomCoverageField from './CustomCoverageField';

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
      >
        <Field
          component={CustomCoverageField}
          index={index}
          name={`${name}[${index}]`}
        />
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
