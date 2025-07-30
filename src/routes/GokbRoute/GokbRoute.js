import PropTypes from 'prop-types';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import { useState } from 'react';

import { SASQRoute } from '@k-int/stripes-kint-components';
import config from '../../../docs/gokb-search-v1';

import { searchConfigTypeHandler } from '../utilities/adjustments/searchConfigConstructor';

const GokbRoute = ({ location }) => {
  // Build search configuration from the config file
  const searchConfig = config.configuration.results.fetch.search;

  const [queryState, setQueryState] = useState({});
  console.log(queryState);

  const { searchParameterParse, HeaderComponent } = searchConfigTypeHandler({
    type: searchConfig.type,
    searchConfig,
    queryState,
    setQueryState,
  });

  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/api/find',
    SASQMap: {
      searchKey: queryState?.searchKey || '',
    },
  };

  // Function to generate the GOKb query string based on the current state
  // Not very happy with this at the moment,its a bit more a bespoke piece of work and doesnt adjust to the searchConfig
  // Something to revisit in the future, once we have all the query parts in place
  const generateGokbQuery = (params, query) => {
    // Additionally this offset handlinig work needs to be dynamically handled based on search config
    const perPage = params?.perPage || 25;
    const offset = (params.page - 1) * perPage;
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

    queryParts.push(`max=${perPage}`);
    queryParts.push(`offset=${offset}`);
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
          totalRecords: data.count,
          results: data.records,
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
