import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import gokbConfig from '../../../docs/gokb-search-v1';

// Result Columns
export const getResultColumns = () => gokbConfig.configuration.results.display.columns.map(col => ({
  propertyPath: col.name,
  label: <FormattedMessage id={`ui-agreements.gokb.${col.name}`} />
}));

// String Formatter
export const getStringFormatter = () => Object.fromEntries(
  gokbConfig.configuration.results.display.columns
    .filter(col => col.type === 'String' && col.name && col.value?.expression)
    .map(col => [
      col.name,
      (resource) => JSONPath({ path: col.value.expression, json: resource })
    ])
);

// Array Formatter
export const getArrayFormatter = () => Object.fromEntries(
  gokbConfig.configuration.results.display.columns
    .filter(col => col.type === 'Array' && col.name && col.value?.expression)
    .map(col => [
      col.name,
      (resource) => {
        const result = JSONPath({ path: col.value.expression, json: resource });
        return col.joinStrategy === 'Comma'
          ? (result || []).filter(Boolean).join(', ')
          : result;
      }
    ])
);
