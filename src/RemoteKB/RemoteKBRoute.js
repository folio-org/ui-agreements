import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import kyImport from 'ky';

import { AppIcon } from '@folio/stripes/core';

import { MessageBanner } from '@folio/stripes/components';
import {
  ColumnManagerMenu,
  useColumnManager,
} from '@folio/stripes/smart-components';

import { useSASQQIndex } from '@folio/stripes-erm-components';

import { SASQRoute, SASQTableBody } from '@k-int/stripes-kint-components';
import RemoteKbResource from './components/RemoteKbResourceView';

import config from '../../docs/gokb-search-v1';

import RemoteKbFilters from './components/RemoteKbFilters';

import {
  getFilterConfig,
  transformFilterString,
  handlebarsCompile,
  searchConfigTypeHandler,
  getResultsDisplayConfig,
  getSortConfig,
} from './utilities';

const propTypes = {
  externalKbInfo: PropTypes.shape({
    baseOrigin: PropTypes.string.isRequired,
    kbCount: PropTypes.number,
    kbName: PropTypes.string.isRequired,
  }).isRequired,
};

const RemoteKBRoute = ({ externalKbInfo }) => {
  const { baseOrigin, kbCount, kbName } = externalKbInfo;

  const TableBodyComponent = (props) => {
    return (
      <>
        {kbCount > 1 &&
          <MessageBanner type="warning">
            <FormattedMessage
              id="ui-agreements.remoteKb.warn.externalKbs"
              values={{
                kbName,
                settingsLink: (text) => (
                  <Link to="/settings/local-kb-admin/external-data-sources">{text}</Link>
                ),
              }}
            />
          </MessageBanner>
        }
        <SASQTableBody {...props} />
      </>
    );
  };

  const kbKey = 'gokb';
  const columnsConfig = config.configuration.results.display.columns;
  const displayConfig = config.configuration.view.display;
  const filterConfig = getFilterConfig(config);
  const { filterMap, initialFilterState } = filterConfig;

  const viewFetchConfig = config.configuration.view.fetch;
  const viewQueryIdKey = viewFetchConfig?.viewQueryIdentifierKey || 'id';

  const resolveUrl = (urlConfig) => {
    if (urlConfig?.type === 'handlebars') {
      const template = handlebarsCompile(urlConfig.templateString);
      return template({ baseOrigin });
    }
    return urlConfig;
  };

  const itemEndpointData = {
    endpoint: resolveUrl(viewFetchConfig.baseUrl),
    ...viewFetchConfig.mapping,
  };

  const endpointData = {
    endpoint: resolveUrl(config.configuration.results.fetch.baseUrl),
    ...config.configuration.results.fetch.mapping,
  };

  const FilterComponent = (props) => (
    <RemoteKbFilters {...props} filterConfig={filterConfig} kbKey={kbKey} />
  );

  const ViewComponent = (props) => (
    <RemoteKbResource {...props} baseOrigin={baseOrigin} displayConfig={displayConfig} />
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

  const { qIndexSASQProps } = useSASQQIndex({ defaultQIndex: 'keyword' });

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

      if (searchString) {
        queryParts.push(searchString);
        fetchParameters.SASQMap = {
          ...fetchParameters.SASQMap,
          searchKey,
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
      RenderBody={TableBodyComponent}
      resultColumns={resultColumns}
      sasqProps={{
        initialFilterState,
        sortableColumns,
        ...qIndexSASQProps,
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

RemoteKBRoute.propTypes = propTypes;

export default RemoteKBRoute;
