import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import kyImport from 'ky';

import { AppIcon } from '@folio/stripes/core';

import {
  ColumnManagerMenu,
  useColumnManager,
} from '@folio/stripes/smart-components';

import { SASQRoute } from '@k-int/stripes-kint-components';

import config from '../../../docs/gokb-search-v1';

import { searchConfigTypeHandler } from '../utilities/adjustments/searchConfigConstructor';

import getResultsDisplayConfig from '../utilities/getResultsDisplayConfig';

import GokbFilters from '../../components/GokbFilters';
import {
  getFilterConfig,
  transformFilterString,
} from '../../components/utilities';
import getSortConfig from '../utilities/getSortConfig';

const GokbRoute = ({ location }) => {
  const kbKey = 'gokb';
  const filterConfig = useMemo(() => getFilterConfig(config, kbKey), [kbKey]);
  const { filterMap, initialFilterState } = filterConfig;

  const FilterComponent = (props) => (
    <GokbFilters {...props} filterConfig={filterConfig} kbKey={kbKey} />
  );

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
      id={`${kbKey}-search`}
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
        id: `${kbKey}-search-main-pane`,
        paneTitle: <FormattedMessage id={`ui-agreements.${kbKey}.titles`} />,
      }}
      mclProps={{
        columnWidths: { publicationDates: 300 },
        formatter,
        visibleColumns,
      }}
      path={location.pathname}
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
    />
  );
};

GokbRoute.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default GokbRoute;
