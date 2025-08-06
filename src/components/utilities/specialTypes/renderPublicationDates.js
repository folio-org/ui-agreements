import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';

const renderPublicationDates = (resource, kbKey) => {
  const { dateFirstOnline, dateFirstInPrint, publishedFrom, publishedTo } = resource;

  if (!dateFirstOnline && !dateFirstInPrint && !publishedFrom && !publishedTo) {
    return null;
  }

  return (
    <div>
      {dateFirstOnline && (
        <div>
          <FormattedMessage id={`ui-agreements.${kbKey}.publicationDates.firstOnline`} />:{' '}
          <FormattedUTCDate value={dateFirstOnline} />
        </div>
      )}
      {dateFirstInPrint && (
        <div>
          <FormattedMessage id={`ui-agreements.${kbKey}.publicationDates.firstInPrint`} />:{' '}
          <FormattedUTCDate value={dateFirstInPrint} />
        </div>
      )}
      {(publishedFrom || publishedTo) && (
        <div>
          <FormattedMessage id={`ui-agreements.${kbKey}.publicationDates.publishedFromTo`} />:{' '}
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

export default renderPublicationDates;
