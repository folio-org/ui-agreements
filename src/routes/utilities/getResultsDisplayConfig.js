import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { AppIcon } from '@folio/stripes/core';
import { handlebarsCompile, renderPublicationDates } from '../../components/utilities';

import gokbConfig from '../../../docs/gokb-search-v1';

/* helper functions */

const applyJsonPath = (expression, resource) => JSONPath({ path: expression, json: resource }) || [];

const applyRenderStrategy = (results, strategy) => {
  const defaultSeparator = ', ';
  if (!strategy?.type) return results.join(defaultSeparator);

  switch (strategy.type) {
    case 'joinString':
      return results.join(strategy.separator || defaultSeparator);
    case 'renderPublicationDates':
      return renderPublicationDates(results, 'gokb');
    default:
      return results.join(defaultSeparator);
  }
};

/* Recursive formatter function */

const getFormatterFunction = (type, col, inheritedRenderStrategy = undefined) => {
  const { value = {}, templateString, renderStrategy = inheritedRenderStrategy } = col;
  const recurse = () => getFormatterFunction(value?.type, value, renderStrategy);

  switch (type) {
    case 'access':
      return (resource) => {
        let results = [];

        if (col.accessType === 'JSONPath') {
          results = applyJsonPath(col.expression, resource);
        } else if (col.accessType === 'compiled') {
          results = col.expression;
        }

        return applyRenderStrategy(results, renderStrategy) || '';
      };
    case 'keyValue':
      return (resource) => {
        const combinedData = {};
        value.forEach(({ key, expression }) => {
          const jsonResult = applyJsonPath(expression, resource);
          if (key && jsonResult?.length > 0) {
            combinedData[key] = jsonResult[0];
          }
        });
        return applyRenderStrategy(combinedData, renderStrategy);
      };
    case 'String':
      return recurse();
    case 'Array':
      return recurse();
    case 'Handlebars':
    case 'HandlebarsEach':
      if (value?.type === 'access' && value?.accessType === 'JSONPath') {
        return (resource) => {
          const results = applyJsonPath(value.expression, resource);
          const template = handlebarsCompile(templateString);

          const formatter = getFormatterFunction('String', {
            value: {
              type: 'access',
              accessType: 'compiled',
              expression: results.map(obj => template(obj))
            }
          }, renderStrategy);

          return formatter(resource);
        };
      } else {
        return recurse();
      }
    case 'Object':
      return recurse();
    default:
      return () => '';
  }
};

/* Main exported function */

const getResultsDisplayConfig = () => {
  const columns = gokbConfig.configuration.results.display.columns;

  const resultColumns = [];
  const sortableColumns = [];
  const formatter = {};

  columns.forEach((col, index) => {
    const { name, type, sortable } = col;

    if (sortable) sortableColumns.push(name);

    resultColumns.push({
      propertyPath: name,
      label: <FormattedMessage id={`ui-agreements.gokb.${name}`} />
    });

    const fn = getFormatterFunction(type, col);
    if (fn) {
      formatter[name] = (resource) => {
        const content = fn(resource);

        if (index === 0) {
          return (
            <AppIcon
              app="agreements"
              iconAlignment="baseline"
              iconKey="title"
              size="small"
            >
              {content}
            </AppIcon>
          );
        }

        return content;
      };
    }
  });

  const endpointData = {
    endpoint: gokbConfig.configuration.results.fetch.baseUrl,
    ...gokbConfig.configuration.results.fetch.mapping,
  };

  return {
    resultColumns,
    sortableColumns,
    formatter,
    ...endpointData,
  };
};

export default getResultsDisplayConfig;
