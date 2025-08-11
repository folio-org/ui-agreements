import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import kyImport from 'ky';

import { AppIcon } from '@folio/stripes/core';

import {
  ColumnManagerMenu,
  useColumnManager,
} from '@folio/stripes/smart-components';

import { SASQRoute } from '@k-int/stripes-kint-components';
import RemoteKbResource from '../../components/views/RemoteKbResource';

import config from '../../../docs/gokb-search-v1';

import { searchConfigTypeHandler } from '../utilities/adjustments/searchConfigConstructor';

import getResultsDisplayConfig from '../utilities/getResultsDisplayConfig';

const GokbRoute = ({ location }) => {
  const kbKey = 'gokb';
  console.log('GokbRoute location', location);
  const hookParams = useParams();
  // const titleId = hookParams?.id || '';
  console.log('GokbRoute params', hookParams);
  const history = useHistory();
  console.log('GokbRoute history', history);
  const { pathname } = useLocation();
  console.log('GokbRoute pathname', pathname);

  const resourcePath = config.configuration.view.fetch.mapping.data;
  const resourceEndpoint = config.configuration.view.fetch.baseUrl;
  console.log('GokbRoute resourcePath', resourcePath);
  const {
    endpoint: gokbEndpoint,
    formatter,
    resultColumns,
    sortableColumns,
    results: resultsPath,
    totalRecords: totalRecordsPath,
  } = getResultsDisplayConfig();

  const fetchParameters = {
    endpoint: gokbEndpoint,
    itemEndpoint: resourceEndpoint,
    SASQ_MAP: {},
  };

  // Build search configuration from the config file
  const searchConfig = config.configuration.results.fetch.search;

  const { searchParameterParse, HeaderComponent } = searchConfigTypeHandler({
    type: searchConfig.type,
    searchConfig,
  });

  // Function to generate the GOKb query string based on the current state
  // Not very happy with this at the moment,its a bit more a bespoke piece of work and doesnt adjust to the searchConfig
  // Something to revisit in the future, once we have all the query parts in place
  const generateQuery = (params, query) => {
    console.log('generateQuery', params, query);
    const perPage = params?.perPage || 25;
    // Offset handling should be based on config file, picking up as part of refactors
    const offset = (params.page - 1) * params.perPage;
    const queryParts = [];

    if (query?.query) {
      const { key: searchKey, string: searchString } = searchParameterParse(
        query?.query
      );
      if (searchString) {
        queryParts.push(searchString);
        fetchParameters.SASQMap = {
          ...fetchParameters.SASQMap,
          searchKey
        };
      }
    }

    queryParts.push(`max=${perPage}`);
    queryParts.push(`offset=${offset}`);
    return `?${queryParts.join('&')}`;
  };

  const columnMapping = resultColumns?.length
    ? Object.fromEntries(
      resultColumns.map((col) => [col.propertyPath, col.label])
    )
    : {};

  const { visibleColumns, toggleColumn } = useColumnManager(
    'gokb-search-list-column-manager',
    columnMapping
  );

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
      FilterPaneHeaderComponent={HeaderComponent}
      filterPaneProps={{
        id: 'gokb-search-main-filter-pane',
      }}
      id="gokb-search"
      lookupQueryPromise={({ _ky, queryParams, endpoint }) => {
        return kyImport.get(`${endpoint}${queryParams}`).json();
      }}
      lookupResponseTransform={(data) => {
        const transformedData = {
          ...data,
          totalRecords: data?.[totalRecordsPath],
          results: data?.[resultsPath],
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
        visibleColumns,
      }}
      // path={location.pathname}
      path={`/erm/${kbKey}`}
      persistedPanesetProps={{
        id: 'gokb-search-main-paneset',
      }}
      queryParameterGenerator={generateQuery}
      resultColumns={resultColumns}
      sasqProps={{
        sortableColumns,
      }}
      searchFieldAriaLabel="input-gokb-search"
      ViewComponent={RemoteKbResource}
      viewQueryPromise={({ _ky, resourceId, endpoint }) => {
        return kyImport.get(`${endpoint}/${resourceId}`).json();
      }}
      // viewResponseTransform={(data) => {
      //   const transformedData = {
      //     // ...data?.records[0]
      //     ...data?.[resourcePath],
      //   };
      //   return transformedData;
      // }}
      viewResponseTransform={(data) => {
        const raw = data?.[resourcePath];
        return Array.isArray(raw) ? raw[0] : raw;
      }}
    />
  );
};

GokbRoute.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default GokbRoute;
