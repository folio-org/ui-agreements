import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Layout, Tooltip } from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';
import CoverageField from './CoverageField';

const CoverageFieldArray = ({
  addButtonId,
  addButtonTooltipId,
  addLabelId,
  deleteButtonTooltipId,
  disabled,
  headerId,
  id,
  fields: { name },
  isEmptyCoverageId = 'ui-agreements.emptyAccordion.lineCustomCoverage',
}) => {
  const { items, onAddField, onDeleteField } = useKiwtFieldArray(name);
  const renderCoverages = () => {
    return items.length ? items.map((coverage, index) => (
      <EditCard
        key={index}
        data-test-coverage-number={index}
        data-testid={`coverageFieldArray[${index}]`}
        deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
        header={<FormattedMessage id={headerId} values={{ number: index + 1 }} />}
        onDelete={() => onDeleteField(index, coverage)}
      >
        <Field
          component={CoverageField}
          index={index}
          name={`${name}[${index}]`}
        />
      </EditCard>
    )) : (
      <Layout className="padding-bottom-gutter">
        <FormattedMessage id={isEmptyCoverageId} />
      </Layout>
    );
  };

  return (
    <div>
      <div
        data-testid="coverageFieldArray"
        id={id}
      >
        {renderCoverages()}
      </div>
      {
        addButtonTooltipId && disabled ? (
          <Tooltip
            id="add-coverage-button-tooltip"
            placement="bottom-start"
            text={<FormattedMessage id={addButtonTooltipId} />}
          >
            {({ ref, ariaIds }) => (
              <div
                ref={ref}
                aria-labelledby={ariaIds.text}
              >
                <Button
                  disabled={disabled}
                  id={addButtonId}
                >
                  <FormattedMessage id={addLabelId} />
                </Button>
              </div>
            )}
          </Tooltip>
        ) : (
          <Button id={addButtonId} onClick={() => onAddField()}>
            <FormattedMessage id={addLabelId} />
          </Button>
        )
      }
    </div>
  );
};

CoverageFieldArray.propTypes = {
  addButtonId: PropTypes.string,
  addButtonTooltipId: PropTypes.string,
  addLabelId: PropTypes.string,
  deleteButtonTooltipId: PropTypes.string,
  disabled: PropTypes.bool,
  headerId: PropTypes.string,
  id: PropTypes.string,
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
  isEmptyCoverageId: PropTypes.string,
};

export default CoverageFieldArray;
