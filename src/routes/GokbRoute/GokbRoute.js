import PropTypes from 'prop-types';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import handlebars from 'handlebars';

import { useIntl } from 'react-intl';

import { SASQRoute } from '@k-int/stripes-kint-components';

import { getSearchableIndexes, generateGokbQuery, config } from '../../utils/searchTransformation';

const GokbRoute = ({ location }) => {
  const intl = useIntl();
  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/rest/titles',
    SASQ_MAP: {
      searchKey: 'uuid',
    },
  };

  const generateQuery = (params, query) => {
    return generateGokbQuery(params, query, config.configuration.results.fetch.search);
  };

  const searchableIndexes = getSearchableIndexes(intl.formatMessage);

  const resultColumns = [
    {
      propertyPath: 'name',
      label: 'Name',
    },
    {
      propertyPath: 'type',
      label: 'Publication type',
    },
    {
      propertyPath: 'uuid',
      label: 'GOKb UUID',
    },
  ];

  const formatter = {
    name: (resource) => JSONPath({ path: '$.name', json: resource }),
  };

  return (
    <SASQRoute
      fetchParameters={fetchParameters}
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
      searchableIndexes={searchableIndexes}
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
