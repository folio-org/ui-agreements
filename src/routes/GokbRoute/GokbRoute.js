import { FormattedMessage } from 'react-intl';

import kyImport from 'ky';

import { AppIcon } from '@folio/stripes/core';

import {
  ColumnManagerMenu,
  useColumnManager,
} from '@folio/stripes/smart-components';

import { SASQRoute, useQIndex } from '@k-int/stripes-kint-components';
import RemoteKbResource from '../../components/views/RemoteKbResource';

import config from '../../../docs/gokb-search-v1';

import { searchConfigTypeHandler } from '../utilities/adjustments/searchConfigConstructor';

import getResultsDisplayConfig from '../utilities/getResultsDisplayConfig';

import RemoteKbFilters from '../../components/RemoteKbFilters';
import {
  getFilterConfig,
  transformFilterString,
  handlebarsCompile,
} from '../../components/utilities';
import getSortConfig from '../utilities/getSortConfig';

const GokbRoute = () => {
  const kbKey = 'gokb';
  const columnsConfig = config.configuration.results.display.columns;
  const displayConfig = config.configuration.view.display;
  const filterConfig = getFilterConfig(config);
  const { filterMap, initialFilterState } = filterConfig;

  const [qindex, setQindex] = useQIndex();

  const viewFetchConfig = config.configuration.view.fetch;
  const viewQueryIdKey = viewFetchConfig?.viewQueryIdentifierKey || 'id';

  const itemEndpointData = {
    endpoint: viewFetchConfig.baseUrl,
    ...viewFetchConfig.mapping,
  };

  const endpointData = {
    endpoint: config.configuration.results.fetch.baseUrl,
    ...config.configuration.results.fetch.mapping,
  };

  const FilterComponent = (props) => (
    <RemoteKbFilters {...props} filterConfig={filterConfig} kbKey={kbKey} />
  );

  const ViewComponent = (props) => (
    <RemoteKbResource {...props} displayConfig={displayConfig} />
  );

  const { formatter, resultColumns, sortableColumns } = getResultsDisplayConfig(
    columnsConfig,
    { iconKey: displayConfig.icon }
  );

  const fetchParameters = {
    endpoint: endpointData.endpoint,
    itemEndpoint: itemEndpointData.endpoint,
    SASQ_MAP: {},
  };

  // Build search configuration from the config file
  const searchConfig = config.configuration.results.fetch.search;

  const { searchParameterParse, HeaderComponent } = searchConfigTypeHandler({
    type: searchConfig.type,
    searchConfig,
  });

  const { sortQueryFunction } = getSortConfig(
    config.configuration.results.fetch.sort
  );

  // Function to generate the GOKb query string based on the current state
  // Not very happy with this at the moment,its a bit more a bespoke piece of work and doesnt adjust to the searchConfig
  // Something to revisit in the future, once we have all the query parts in place
  const generateQuery = (params, query) => {
    const perPage = params?.perPage || 25;
    // Offset handling should be based on config file, picking up as part of refactors
    const offset = (params.page - 1) * params.perPage;
    const queryParts = [];

    if (query?.query) {
      const { key: searchKey, string: searchString } = searchParameterParse(
        query?.query
      );

      if (searchKey !== qindex) {
        setQindex(searchKey);
      }

      if (searchString) {
        queryParts.push(searchString);
        fetchParameters.SASQMap = {
          ...fetchParameters.SASQMap,
          searchKey: qindex,
          filterKeys: filterMap,
        };
      }
    }

    const sortString = sortQueryFunction(query);
    if (sortString) {
      queryParts.push(sortString);
    }

    const filterString = transformFilterString(query?.filters, config);
    if (filterString) {
      queryParts.push(filterString);
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
    `${kbKey}-search-list-column-manager`,
    columnMapping
  );

  const renderActionMenu = () => {
    return (
      <ColumnManagerMenu
        columnMapping={columnMapping}
        excludeColumns={['name']}
        prefix={`${kbKey}-search-list`}
        toggleColumn={toggleColumn}
        visibleColumns={visibleColumns}
      />
    );
  };

  return (
    <SASQRoute
      fetchParameters={fetchParameters}
      FilterComponent={FilterComponent}
      FilterPaneHeaderComponent={HeaderComponent}
      filterPaneProps={{
        id: `${kbKey}-search-main-filter-pane`,
      }}
      getNavigationIdentifier={(row) => row?.[viewQueryIdKey]}
      id={`${kbKey}-search`}
      lookupQueryPromise={({ _ky, queryParams, endpoint }) => {
        return kyImport.get(`${endpoint}${queryParams}`).json();
      }}
      lookupResponseTransform={(data) => {
        const transformedData = {
          ...data,
          totalRecords: data?.[endpointData.totalRecords],
          results: data?.[endpointData.results],
        };
        return transformedData;
      }}
      mainPaneProps={{
        actionMenu: renderActionMenu,
        appIcon: (
          <AppIcon app="agreements" iconKey={displayConfig.icon} size="small" />
        ),
        id: `${kbKey}-search-main-pane`,
        paneTitle: <FormattedMessage id="ui-agreements.remoteKb.gokbTitles" />,
      }}
      mclProps={{
        columnWidths: { publicationDates: 300 },
        formatter,
        visibleColumns,
      }}
      path={`/erm/${kbKey}`}
      persistedPanesetProps={{
        id: `${kbKey}-search-main-paneset`,
      }}
      queryParameterGenerator={generateQuery}
      resultColumns={resultColumns}
      sasqProps={{
        initialFilterState,
        sortableColumns,
      }}
      searchFieldAriaLabel={`input-${kbKey}-search`}
      ViewComponent={ViewComponent}
      viewQueryPromise={({ _ky, resourceId, endpoint }) => {
        if (viewFetchConfig?.viewQueryUrl?.templateString) {
          const template = handlebarsCompile(
            viewFetchConfig.viewQueryUrl.templateString
          );
          const url = template({ endpoint, resourceId });
          return kyImport.get(url).json();
        }
        return kyImport.get(`${endpoint}/${resourceId}`).json();
      }}
      viewResponseTransform={(data) => {
        const raw = data?.[itemEndpointData.data];
        return Array.isArray(raw) ? raw[0] : raw;
      }}
    />
  );
};

export default GokbRoute;
