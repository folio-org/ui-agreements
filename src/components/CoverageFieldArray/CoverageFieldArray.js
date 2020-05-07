import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button } from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import CoverageField from './CoverageField';

class CoverageFieldArray extends React.Component {
  static propTypes = {
    addButtonId: PropTypes.string,
    addLabelId: PropTypes.string,
    deleteButtonTooltipId: PropTypes.string,
    headerId: PropTypes.string,
    id: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  }

  renderCoverages = () => {
    const { deleteButtonTooltipId, headerId, items, name } = this.props;

    return items.map((coverage, index) => (
      <EditCard
        key={index}
        data-test-coverage-number={index}
        deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
        header={<FormattedMessage id={headerId} values={{ number: index + 1 }} />}
        onDelete={() => this.props.onDeleteField(index, coverage)}
      >
        <Field
          component={CoverageField}
          index={index}
          name={`${name}[${index}]`}
        />
      </EditCard>
    ));
  }

  render = () => {
    const { addButtonId, addLabelId, id } = this.props;
    return (
      <div>
        <div id={id}>
          {this.renderCoverages()}
        </div>
        <Button id={addButtonId} onClick={() => this.props.onAddField()}>
          <FormattedMessage id={addLabelId} />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(CoverageFieldArray);
