import PropTypes from 'prop-types';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import { useState, useCallback, useMemo } from 'react';

import { SASQRoute } from '@k-int/stripes-kint-components';
import config from '../../../docs/gokb-search-v1.json';

import { generateKiwtQueryParams } from '../utilities/searchTransformation';
import { buildSearchHeaderComponent } from '../utilities/searchComponentBuilder';

const GokbRoute = ({ location }) => {
  const [searchKey, setSearchKey] = useState('keyword');
  const [SASQMap, setSASQMap] = useState({ searchKey: 'keyword' });

  // Build search configuration from the config file
  const searchConfig = config.configuration.results.fetch.search;

  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/rest/titles',
    SASQ_MAP: SASQMap,
  };

  const generateQuery = useCallback((params, query) => {
    const queryWithSearchKey = { ...query, qindex: searchKey };
    return generateKiwtQueryParams(searchConfig, SASQMap, params, queryWithSearchKey);
  }, [searchKey, searchConfig, SASQMap]);

  const resultColumns = [
    {
      propertyPath: 'name',
      label: 'Name',
    },
  ];

  const formatter = {
    name: (resource) => JSONPath({ path: '$.name', json: resource }),
  };

  // Build header component dynamically from config
  const headerComponentConfig = useMemo(() => {
    return buildSearchHeaderComponent(searchConfig, {
      onChange: (event) => {
        const newSearchKey = event.target.value;
        setSearchKey(newSearchKey);

        // Update SASQ map based on the selection
        setSASQMap({ searchKey: newSearchKey });
      },
      value: searchKey,
      id: 'gokb-search-header-select'
    });
  }, [searchConfig, searchKey]);

  const renderHeaderComponent = useCallback(() => {
    return headerComponentConfig?.component || null;
  }, [headerComponentConfig]);

  return (
    <SASQRoute
      key={searchKey}
      fetchParameters={fetchParameters}
      FilterPaneHeaderComponent={renderHeaderComponent}
      filterPaneProps={{
        id: 'gokb-search-main-filter-pane',
      }}
      id="gokb-search"
      lookupQueryPromise={({ _ky, queryParams, endpoint }) => kyImport.get(`${endpoint}${queryParams}`).json()}
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
      queryParameterGenerator={generateQuery}
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
