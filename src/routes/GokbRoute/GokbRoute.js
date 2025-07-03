import PropTypes from 'prop-types';

import kyImport from 'ky';
import jsonpath from 'jsonpath';

import { SASQRoute } from '@k-int/stripes-kint-components';

const GokbRoute = ({ location }) => {
  const fetchParameters = {
    endpoint: 'https://gokb.org/gokb/rest/titles',
    SASQ_MAP: {
      searchKey: 'uuid',
    },
  };

  const generateQuery = (params, _query) => {
    const offset = (params.page - 1) * params.perPage;

    return `?max=${params.perPage}&offset=${offset}&es=true`;
  };

  // When building the SASQ from the config file, using the results.display values
  // should construct a formatter and resultColumns object
  const resultColumns = [
    {
      propertyPath: 'name',
      label: 'Name',
    },
  ];

  const formatter = {
    name: (resource) => {
      const name = jsonpath.query(resource, '$.name');
      return name;
    },
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
