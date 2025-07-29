import PropTypes from 'prop-types';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import handlebars from 'handlebars';

import { SASQRoute } from '@k-int/stripes-kint-components';

import GokbFilters from '../../components/GokbFilters';
import { getFilterConfig } from '../../components/utilities';


const GokbRoute = ({ location }) => {
  const { filterMap, initialFilterState } = getFilterConfig();
  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/api/find',
    SASQ_MAP: {
      searchKey: 'uuid',
      filterKeys: filterMap,
    },
  };

  const generateQuery = (params, query) => {
    const offset = (params.page - 1) * params.perPage;

    // EXAMPLE: Using handlebars to generate the query string
    // Namely name will be the field configured by the results.fetch.search key and its "handlebars template type"
    // max & offset are configured by the pagination parameters
    const template = handlebars.compile(
      '?name={{input}}&max={{perPage}}&offset={{offset}}'
    );

    const filterString = Object.entries(params.filterKeys || {})
      .map(([key, path]) => {
        const filterValue = (query.filters || '')
          .split(',')
          .find(f => f.startsWith(`${key}.`))
          ?.split('.')[1];
        return filterValue ? `&${path}=${filterValue}` : null;
      })
      .filter(Boolean)
      .join('');

    // return template({
    //   input: query?.query || '',
    //   perPage: params?.perPage,
    //   offset,
    // });

    const baseQuery = template({
      input: query?.query || '',
      perPage: params?.perPage,
      offset,
    });

    // Append `filterString` manually not possible with handlebar template
    // as it does not support dynamic keys in the template
    return `${baseQuery}${filterString}`;
  };

  // When building the SASQ from the config file, using the results.display values
  // should construct a formatter and resultColumns object
  const resultColumns = [
    {
      propertyPath: 'name',
      label: 'Name',
    },
  ];

  // EXAMPLE: Using JSONPath to format the results
  const formatter = {
    name: (resource) => JSONPath({ path: '$.name', json: resource }),
  };

  return (
    <SASQRoute
      fetchParameters={fetchParameters}
      FilterComponent={GokbFilters}
      filterPaneProps={{
        id: 'gokb-search-main-filter-pane',
      }}
      id="gokb-search"
      lookupQueryPromise={({ _ky, queryParams, endpoint }) => kyImport.get(`${endpoint}${queryParams}`).json()
      }
      lookupResponseTransform={(data) => {
        const transformedData = {
          ...data,
          totalRecords: data.count,
          results: data?.records,
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
      sasqProps={{
        initialFilterState
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
