import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Button, Layout, Spinner } from '@folio/stripes/components';
import { requiredObjectValidator } from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import IfEResourcesEnabled from '../IfEResourcesEnabled';
import { isExternal } from '../utilities';

import AgreementLineField from './AgreementLineField';

const AgreementLinesFieldArray = ({
  data,
  fields: { name },
}) => {
  const { items, onAddField, onDeleteField, onReplaceField } = useKiwtFieldArray(name, true);

  const getLineResource = (line) => {
    if (line.resource) return line.resource;

    if (line.id) {
      const savedLine = data.agreementLines.find(l => l.id === line.id);
      if (savedLine) {
        if (savedLine.type === 'detached') return savedLine;
        return isExternal(savedLine) ? savedLine : savedLine.resource;
      }
    }

    if (isExternal(line)) {
      return line;
    }

    return undefined;
  };

  const handleResourceSelected = (index, resource) => {
    onReplaceField(index, { resource });
  };

  const renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.agreementLines.noLines" />
    </Layout>
  );

  const renderLines = () => {
    return items.map((line, i) => (
      <Field
        key={i}
        basket={data.basket}
        component={AgreementLineField}
        data-testid={`agreementLinesFieldArray[${i}]`}
        index={i}
        name={`${name}[${i}]`}
        onDelete={() => onDeleteField(i, line)}
        onResourceSelected={handleResourceSelected}
        poLines={data.orderLines || []}
        resource={getLineResource(line)}
        validate={requiredObjectValidator}
      />
    ));
  };
  return (
    <div>
      {data.areLinesLoading ?
        <Spinner /> :
        <>
          <div id="agreement-form-lines">
            {items.length ? renderLines() : renderEmpty()}
          </div>
          <IfEResourcesEnabled>
            <Button id="add-agreement-line-button" onClick={() => onAddField()}>
              <FormattedMessage id="ui-agreements.agreementLines.addLine" />
            </Button>
          </IfEResourcesEnabled>
        </>
      }
    </div>
  );
};

AgreementLinesFieldArray.propTypes = {
  data: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    orderLines: PropTypes.arrayOf(PropTypes.object),
    areLinesLoading: PropTypes.bool
  }),
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default AgreementLinesFieldArray;
