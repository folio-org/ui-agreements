import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import kyImport from 'ky';
import handlebars from 'handlebars';

import { AppIcon } from '@folio/stripes/core';
import { ColumnManagerMenu, useColumnManager } from '@folio/stripes/smart-components';

import { SASQRoute } from '@k-int/stripes-kint-components';

import { getResultColumns, getEndpointData, getFormatter } from '../utilities/gokbConfigUtils';

const GokbRoute = ({ location }) => {
  const { endpoint: gokbEndpoint, results: resultsPath, totalRecords: totalRecordsPath } = getEndpointData();

  const fetchParameters = {
    endpoint: gokbEndpoint,
    SASQ_MAP: {
      searchKey: 'uuid',
    },
  };

  // EXAMPLE: Using handlebars to generate the query string
  // Namely name will be the field configured by the results.fetch.search key and its "handlebars template type"
  // max & offset are configured by the pagination parameters
  const template = handlebars.compile(
    '?name={{input}}&max={{perPage}}&offset={{offset}}&sort={{sortField}}&order={{sortOrder}}'
  );

  const generateQuery = (params, query) => {
    const offset = (params.page - 1) * params.perPage;

    const sortFieldRaw = query?.sort || '';
    const sortField = sortFieldRaw.startsWith('-') ? sortFieldRaw.slice(1) : sortFieldRaw;
    const sortOrder = sortFieldRaw.startsWith('-') ? 'desc' : 'asc';

    return template({
      input: query?.query || '',
      perPage: params?.perPage,
      offset,
      sortField: sortField || undefined,
      sortOrder: sortField ? sortOrder : undefined,
    });
  };

  // When building the SASQ from the config file, using the results.display values
  // should construct a formatter and resultColumns object

  // EXAMPLE: Using JSONPath to format the results
  // const formatter = {
  //   name: (resource) => JSONPath({ path: '$.name', json: resource }),
  // };

  const resultColumns = getResultColumns();
  const formatter = getFormatter();

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
          totalRecords: data?.[totalRecordsPath],
          results: data?.[resultsPath]
        };
        return transformedData;
      }}
      mainPaneProps={{
        actionMenu: renderActionMenu,
        appIcon: <AppIcon app="agreements" iconKey="title" size="small" />,
        id: 'gokb-search-main-pane',
        paneTitle: <FormattedMessage id="ui-agreements.gokb.titles" />,
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
      sasqProps={{
        sortableColumns: ['name']
      }}
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
