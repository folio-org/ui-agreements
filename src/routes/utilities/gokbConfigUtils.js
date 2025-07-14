import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';
import gokbConfig from '../../../docs/gokb-search-v1';

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

// Special formatter
export const getSpecialFormatter = () => ({
  otherids: (resource) => {
    const path = gokbConfig.configuration.results.display.columns.find(c => c.name === 'otherids')?.value.expression;

    const result = JSONPath({ path, json: resource }) || [];

    return result
      .filter(id => id.value)
      .map(id => `${id.namespace.name || id.namespace.value}: ${id.value}`)
      .join(', ');
  },
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
  subjects: (resource) => {
    const result = JSONPath({ path: '$.subjects[*]', json: resource }) || [];
    return result
      .filter(item => item.scheme || item.heading)
      .map(item => `${item.scheme ?? ''}: ${item.heading ?? ''}`)
      .join(', ');
  },
});

// Order of concatenation matters, getSpecialFormatter has to be last, overwriting getArrayFormatter and getStringFormatter
export const getFormatter = () => ({
  ...getStringFormatter(),
  ...getArrayFormatter(),
  ...getSpecialFormatter(),
});
