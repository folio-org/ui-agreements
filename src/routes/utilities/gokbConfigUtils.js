import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';
import gokbConfig from '../../../docs/gokb-search-v1';

// transform endpoint specific data to match SASQ expectations

export const getEndpointData = () => {
  return {
    endpoint: gokbConfig.configuration.results.fetch.baseUrl,
    ...gokbConfig.configuration.results.fetch.mapping,
  };
};

// Result columns
export const getResultColumns = () => gokbConfig.configuration.results.display.columns.map(col => ({
  propertyPath: col.name,
  label: <FormattedMessage id={`ui-agreements.gokb.${col.name}`} />
}));

// String formatter
export const getStringFormatter = () => Object.fromEntries(
  gokbConfig.configuration.results.display.columns
    .filter(col => col.type === 'String' && col.name && col.value?.expression)
    .map(col => [
      col.name,
      (resource) => JSONPath({ path: col.value.expression, json: resource })
    ])
);

// Array formatter / for string elements / concatenated by comma
export const getArrayFormatter = () => Object.fromEntries(
  gokbConfig.configuration.results.display.columns
    .filter(col => col.type === 'Array' && col.arrayType === 'String' && col.name && col.value?.expression)
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

// Array of objects formatter, "item1.prop1: item1.prop2, item2.prop1: item2.prop2, ..."
export const getArrayOfObjectsFormatter = () => Object.fromEntries(
  gokbConfig.configuration.results.display.columns
    .filter(col => col.type === 'Array' && col.arrayType === 'Object' && col.name && col.value?.expression && col.fieldMapping?.length === 2)
    .map(col => [
      col.name,
      (resource) => {
        const [field1, field2] = col.fieldMapping;
        const result = JSONPath({ path: col.value.expression, json: resource }) || [];
        return result
          .filter(obj => obj?.[field1] && obj?.[field2])
          .map(obj => `${obj[field1]}: ${obj[field2]}`)
          .join(', ');
      }
    ])
);

// Special formatter
export const getSpecialFormatter = () => ({
  // we take the output of string formatter and cut of "Instance" at the end, eg. "BookInstance" -> "Book"
  publicationType: (resource) => getStringFormatter().publicationType(resource)?.map(pt => pt.replace(/Instance$/, '')),
  publicationDates: (resource) => {
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
  },
});

// Order of concatenation matters, getSpecialFormatter has to be last, overwriting other formatters
export const getFormatter = () => ({
  ...getStringFormatter(),
  ...getArrayFormatter(),
  ...getArrayOfObjectsFormatter(),
  ...getSpecialFormatter(),
});
