import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';
import handlebars from 'handlebars';

import gokbConfig from '../../../docs/gokb-search-v1';

/* HELPERS */

const applyJsonPath = (expression, resource) => JSONPath({ path: expression, json: resource }) || [];

// const applyPostProcessing = (value, postProcess = []) => {
//   return postProcess.reduce((result, step) => {
//     if (step.type === 'replace') {
//       const [from, to] = step.args;
//       return result.replace(new RegExp(from, 'g'), to);
//     }
//     return result;
//   }, value);
// };

const formatDatesDisplay = () => {
  return (resource) => {
    const { dateFirstOnline, dateFirstInPrint, publishedFrom, publishedTo } = resource;

    return (
      <div>
        {dateFirstOnline && (
          <div>
            <FormattedMessage id="ui-agreements.gokb.publicationDates.firstOnline" />:{' '}
            <FormattedUTCDate value={dateFirstOnline} />
          </div>
        )}
        {dateFirstInPrint && (
          <div>
            <FormattedMessage id="ui-agreements.gokb.publicationDates.firstInPrint" />:{' '}
            <FormattedUTCDate value={dateFirstInPrint} />
          </div>
        )}
        {(publishedFrom || publishedTo) && (
          <div>
            <FormattedMessage id="ui-agreements.gokb.publicationDates.publishedFromTo" />:{' '}
            <span>
              {publishedFrom ? <FormattedUTCDate value={publishedFrom} /> : '*'}{' '}
              <Icon icon="arrow-right" size="small" />{' '}
              {publishedTo ? <FormattedUTCDate value={publishedTo} /> : '*'}
            </span>
          </div>
        )}
      </div>
    );
  };
};

const getFormatterFunction = (type, col) => {
  const { value = {}, arrayType, templateString, renderStrategy } = col;
  const recurse = () => getFormatterFunction(value?.type, value);
  switch (type) {
    case 'String':
      if (value?.type === 'access') {
        return (resource) => {
          let results = [];

          if (value?.accessType === 'JSONPath') {
            results = applyJsonPath(value.expression, resource);
          } else if (value?.accessType === 'compiled') {
            results = value.expression;
          }

          return results.join(', ') || '';
        };
      } else {
        return recurse();
      }
    case 'Array':
      if (value?.type === 'access' && arrayType === 'String') {
        return getFormatterFunction('String', col);
      } else {
        return recurse();
      }
    case 'HandlebarsEach':
      if (value?.type === 'access' && value?.accessType === 'JSONPath') {
        return (resource) => {
          const results = applyJsonPath(value.expression, resource);
          const template = handlebars.compile(templateString);
          const stringArray = (results || []).map(obj => template(obj));

          // Recursively pass array of strings
          const arrayFormatter = getFormatterFunction('String', {
            value: {
              type: 'access',
              accessType: 'compiled',
              expression: stringArray
            }
          });

          return arrayFormatter(resource);
        };
      } else {
        // fallback to recursive call if shape is unexpected
        return recurse();
      }
    default:
      return () => '';
  }
};

/* MAIN EXPORTED FUNCTION */

const getResultsDisplayConfig = () => {
  const columns = gokbConfig.configuration.results.display.columns;

  const resultColumns = [];
  const formatter = {};

  columns.forEach(col => {
    // const { name, type, value, arrayType, joinStrategy, renderStrategy } = col;
    const { name, type } = col;
    if (!name) return;

    resultColumns.push({
      propertyPath: name,
      label: <FormattedMessage id={`ui-agreements.gokb.${name}`} />
    });

    if (type === 'DatesDisplay') {
      formatter[name] = formatDatesDisplay();
    } else {
      const fn = getFormatterFunction(type, col);
      if (fn) formatter[name] = fn;
    }
  });

  const endpointData = {
    endpoint: gokbConfig.configuration.results.fetch.baseUrl,
    ...gokbConfig.configuration.results.fetch.mapping,
  };

  return {
    resultColumns,
    formatter,
    ...endpointData,
  };
};

export default getResultsDisplayConfig;
