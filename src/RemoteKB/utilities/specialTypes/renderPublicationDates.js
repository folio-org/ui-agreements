import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';

const renderPublicationDates = (resource) => {
  const { dateFirstOnline, dateFirstInPrint, publishedFrom, publishedTo } = resource;

  if (!dateFirstOnline && !dateFirstInPrint && !publishedFrom && !publishedTo) {
    return null;
  }

  return (
    <div>
      {dateFirstOnline && (
        <div>
          <FormattedMessage id="ui-agreements.remoteKb.publicationDates.online" />:{' '}
          <FormattedUTCDate value={dateFirstOnline} />
        </div>
      )}
      {dateFirstInPrint && (
        <div>
          <FormattedMessage id="ui-agreements.remoteKb.publicationDates.print" />:{' '}
          <FormattedUTCDate value={dateFirstInPrint} />
        </div>
      )}
      {(publishedFrom || publishedTo) && (
        <div>
          <FormattedMessage id="ui-agreements.remoteKb.publicationDates.coverage" />:{' '}
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
