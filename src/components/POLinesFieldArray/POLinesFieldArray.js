import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Button, Layout } from '@folio/stripes/components';
import { EditCard, requiredValidator } from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import POLineField from './POLineField';

const POLinesFieldArray = ({
  agreementLineIndex,
  fields: { name },
  poLines: propPoLines = [],
}) => {
  const { items, onAddField, onDeleteField, onUpdateField } = useKiwtFieldArray(name, true);
  const [poLines, setPoLines] = useState([]);

  useEffect(() => {
    if (!poLines.length && propPoLines.length) {
      setPoLines(propPoLines);
    }
  }, [propPoLines, poLines]);

  /* istanbul ignore next */
  const handlePOLineSelected = (index, poLine) => {
    onUpdateField(index, { poLineId: poLine.id });

    setPoLines([
      ...poLines, poLine
    ]);
  };

  const renderPOLines = () => {
    return items.length ? items.map((poLine, index) => (
      <EditCard
        key={index}
        data-test-po-line
        data-testid={`polinesFieldArray[${index}]`}
        deleteBtnProps={{
          'id': `poline-delete-${agreementLineIndex}-${index}`,
          'data-test-delete-field-button': true
        }}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.poLines.remove" values={{ index: index + 1 }} />}
        header={<FormattedMessage id="ui-agreements.poLines.poLineIndex" values={{ index: index + 1 }} />}
        id={`edit-ra-card-${agreementLineIndex}-${index}`}
        onDelete={() => onDeleteField(index, poLine)}
      >
        <Field
          component={POLineField}
          id={`edit-poline-${agreementLineIndex}-${index}`}
          name={`${name}[${index}].poLineId`}
          onPOLineSelected={selectedLine => handlePOLineSelected(index, selectedLine)}
          poLine={poLines.find(l => l.id === poLine.poLineId)}
          validate={requiredValidator}
        />
      </EditCard>
    )) : (
      <Layout className="padding-bottom-gutter">
        <FormattedMessage id="ui-agreements.emptyAccordion.linePOLines" />
      </Layout>
    );
  };

  return (
    <div data-test-polines-fa>
      <div>
        {renderPOLines()}
      </div>
      <Button
        data-test-poline-fa-add-button
        id={`add-poline-btn-${agreementLineIndex}`}
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-agreements.poLines.addPOLine" />
      </Button>
    </div>
  );
};

POLinesFieldArray.propTypes = {
  agreementLineIndex: PropTypes.number,
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
  poLines: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    poLineNumber: PropTypes.string,
  }))
};

export default POLinesFieldArray;
