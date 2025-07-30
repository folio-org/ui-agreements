import PropTypes from 'prop-types';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import { useState, useCallback, useMemo } from 'react';

import { SASQRoute, useQIndex } from '@k-int/stripes-kint-components';
import config from '../../../docs/gokb-search-v1.json';

import { generateKiwtQueryParams } from '../utilities/searchTransformation';
import { buildSearchHeaderComponent } from '../utilities/searchComponentBuilder';
import { searchConfigTypeHandler } from '../utilities/adjustments/searchConfigConstructor';

const GokbRoute = ({ location }) => {
  const [searchKey, setSearchKey] = useState('');

  // Build search configuration from the config file
  const searchConfig = config.configuration.results.fetch.search;

  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/api/find',
    SASQMap: {
      searchKey: searchKey || 'gokbuuid',
    },
  };

  const [queryState, setQueryState] = useState({});

  const { searchParameterParse, HeaderComponent } = searchConfigTypeHandler({
    type: searchConfig.type,
    searchConfig,
    queryState,
    setQueryState,
  });

  const generateGokbQuery = (params, query) => {
    // const perPage = params?.perPage || 25;
    // const offset = (params.page - 1) * perPage;
    const searchString = query?.query || '';

    const queryParts = [];

    if (searchString) {
      const searchParameter = searchParameterParse(
        queryState?.searchKey || '',
        searchString
      );
      if (searchParameter) {
        queryParts.push(searchParameter);
      }
    }

    // queryParts.push(`max=${perPage}`);
    // queryParts.push(`offset=${offset}`);

    // if (query?.sort) {
    //   queryParts.push(`sort=${query.sort}`);
    // }
    // if (query?.order) {
    //   queryParts.push(`order=${query.order}`);
    // }

    return `?${queryParts.join('&')}`;
  };

  const resultColumns = [
    {
      propertyPath: 'name',
      label: 'Name',
    },
  ];

  const formatter = {
    name: (resource) => JSONPath({ path: '$.name', json: resource }),
  };

  return (
    <SASQRoute
      key={searchKey}
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
          totalRecords: data._pagination.total,
          results: data?.data,
        };
        return transformedData;
      }}
      mainPaneProps={{
        id: 'gokb-search-main-pane',
      }}
      mclProps={{
        formatter,
      }}
      path={location.pathname}
      persistedPanesetProps={{
        id: 'gokb-search-main-paneset',
      }}
      queryParameterGenerator={generateGokbQuery}
      resultColumns={resultColumns}
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
