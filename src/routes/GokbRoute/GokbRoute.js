import PropTypes from 'prop-types';

import kyImport from 'ky';
import handlebars from 'handlebars';

import { SASQRoute } from '@k-int/stripes-kint-components';

const GokbRoute = ({ location }) => {
  const fetchParameters = {
    endpoint: 'https://gokb.org/gokb/rest/titles',
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

  const resultColumns = [
    {
      propertyPath: 'uuid',
      label: 'UUID',
    },
  ];

  return (
    <SASQRoute
      fetchParameters={fetchParameters}
      filterPaneProps={{
        id: 'gokb-search-main-filter-pane',
      }}
      id="gokb-search"
      lookupQueryPromise={({ _ky, queryParams, endpoint }) =>
        kyImport.get(`${endpoint}${queryParams}`).json()
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
        id: 'gokb-search-main-pane',
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
  path: PropTypes.string.isRequired,
};

export default GokbRoute;
