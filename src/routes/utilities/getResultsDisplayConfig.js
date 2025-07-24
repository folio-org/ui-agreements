import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';
import handlebars from 'handlebars';

import gokbConfig from '../../../docs/gokb-search-v1';

/* Register handlebar helpers */

handlebars.registerHelper('replace', (text, search, replacement) => {
  if (typeof text !== 'string') return text;
  return text.replace(new RegExp(search, 'g'), replacement);
});

/* Other helper functions */

const applyJsonPath = (expression, resource) => JSONPath({ path: expression, json: resource }) || [];

const applyRenderStrategy = (results, strategy) => {
  const defaultSeparator = ', ';
  if (!strategy || !strategy.type) return results.join(defaultSeparator);

  switch (strategy.type) {
    case 'joinString':
      return results.join(strategy.seperator || defaultSeparator);
    // case 'bulletList':
    //   return results.map(...);
    default:
      return results.join(defaultSeparator);
  }
};

/* Special formatter - not generalizeable */

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

/* Recursive formatter function */

const getFormatterFunction = (type, col, inheritedRenderStrategy = undefined) => {
  const { value = {}, arrayType, templateString, renderStrategy = inheritedRenderStrategy } = col;
  const recurse = () => getFormatterFunction(value?.type, value, renderStrategy);

  const buildHandlebarsFormatter = (isEach = false) => {
    return (resource) => {
      const results = applyJsonPath(value.expression, resource);
      const template = handlebars.compile(templateString);
      const output = isEach
        ? results.map(obj => template(obj))
        : [template({ value: results[0] })];

      const formatter = getFormatterFunction('String', {
        value: {
          type: 'access',
          accessType: 'compiled',
          expression: output
        }
      }, renderStrategy);

      return formatter(resource);
    };
  };

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

          return applyRenderStrategy(results, renderStrategy) || '';
        };
      } else {
        return recurse();
      }
    case 'Array':
      if (value?.type === 'access' && arrayType === 'String') {
        return getFormatterFunction('String', col, renderStrategy);
      } else {
        return recurse();
      }
    case 'HandlebarsEach':
      if (value?.type === 'access' && value?.accessType === 'JSONPath') {
        return buildHandlebarsFormatter(true);
      } else {
        return recurse();
      }
    case 'Handlebars':
      if (value?.type === 'access' && value?.accessType === 'JSONPath') {
        return buildHandlebarsFormatter();
      } else {
        return recurse();
      }
    default:
      return () => '';
  }
};

/* Main exported function */

const getResultsDisplayConfig = () => {
  const columns = gokbConfig.configuration.results.display.columns;

  const resultColumns = [];
  const formatter = {};

  columns.forEach(col => {
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
