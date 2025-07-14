import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import kyImport from 'ky';
import handlebars from 'handlebars';

import { AppIcon } from '@folio/stripes/core';
import { FormattedUTCDate, Icon } from '@folio/stripes/components';
import { ColumnManagerMenu, useColumnManager } from '@folio/stripes/smart-components';

import { SASQRoute } from '@k-int/stripes-kint-components';

import { getResultColumns, getArrayFormatter, getStringFormatter } from '../utilities/gokbConfigUtils';

const GokbRoute = ({ location }) => {
  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/rest/titles',
    SASQ_MAP: {
      searchKey: 'uuid',
    },
  };

  const generateQuery = (params, query) => {
    const offset = (params.page - 1) * params.perPage;

    // EXAMPLE: Using handlebars to generate the query string
    // Namely name will be the field configured by the results.fetch.search key and its "handlebars template type"
    // max & offset are configured by the pagination parameters
    const template = handlebars.compile(
      '?name={{input}}&max={{perPage}}&offset={{offset}}&es=true'
    );

    return template({
      input: query?.query || '',
      perPage: params?.perPage,
      offset,
    });
  };

  // When building the SASQ from the config file, using the results.display values
  // should construct a formatter and resultColumns object

  const resultColumns = getResultColumns();

  // EXAMPLE: Using JSONPath to format the results
  // const formatter = {
  //   name: (resource) => JSONPath({ path: '$.name', json: resource }),
  // };

  const stringFormatter = getStringFormatter();
  const arrayFormatter = getArrayFormatter();

  const specialFormatter = {
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
  };

  const formatter = {
    ...stringFormatter,
    ...arrayFormatter,
    ...specialFormatter
  };

  const columnMapping = resultColumns?.length
    ? Object.fromEntries(resultColumns.map(col => [col.propertyPath, col.label]))
    : {};

  const { visibleColumns, toggleColumn } = useColumnManager('gokb-search-list-column-manager', columnMapping);

  const renderActionMenu = () => {
    return (
      <ColumnManagerMenu
        columnMapping={columnMapping}
        excludeColumns={['name']}
        prefix="gokb-search-list"
        toggleColumn={toggleColumn}
        visibleColumns={visibleColumns}
      />
    );
  };

  return (
    <SASQRoute
      fetchParameters={fetchParameters}
      filterPaneProps={{
        id: 'gokb-search-main-filter-pane',
      }}
      id="gokb-search"
      lookupQueryPromise={({ _ky, queryParams, endpoint }) => kyImport.get(`${endpoint}${queryParams}`).json()
      }
      lookupResponseTransform={(data) => {
        const transformedData = {
          ...data,
          totalRecords: data._pagination.total,
          results: data?.data,
        };
        return transformedData;
      }}
      mainPaneProps={{
        actionMenu: renderActionMenu,
        appIcon: <AppIcon app="agreements" iconKey="package" size="small" />,
        id: 'gokb-search-main-pane',
        paneTitle: <FormattedMessage id="ui-agreements.gokb.packages" />,
      }}
      mclProps={{
        columnWidths: { publicationDates: 300 },
        formatter,
        visibleColumns
      }}
      path={location.pathname}
      persistedPanesetProps={{
        id: 'gokb-search-main-paneset',
      }}
      queryParameterGenerator={generateQuery}
      resultColumns={resultColumns}
      sasqProps={{ initialSortState: { sort: 'name' } }}
      searchFieldAriaLabel="input-gokb-search"
    />
  );
};

GokbRoute.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default GokbRoute;
