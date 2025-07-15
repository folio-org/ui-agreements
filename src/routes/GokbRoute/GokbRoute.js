import PropTypes from 'prop-types';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import { useState } from 'react';
import { Select } from '@folio/stripes/components';

import { useIntl } from 'react-intl';
import { SASQRoute } from '@k-int/stripes-kint-components';
import config from '../../../docs/gokb-search-v1.json';

import { getSearchableIndexes, generateGokbQuery, searchableIndexes } from '../utilities/searchTransformation';

const GokbRoute = ({ location }) => {
  const intl = useIntl();
  const [searchKey, setSearchKey] = useState('keyword');

  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/rest/titles',
    SASQ_MAP: {
      searchKey: 'uuid',
    },
  };

  const generateQuery = (params, query) => {
    // Include searchKey in the query generation
    const queryWithSearchKey = { ...query, qindex: searchKey };
    return generateGokbQuery(params, queryWithSearchKey, config.configuration.results.fetch.search);
  };

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

  const renderHeaderComponent = () => {
    return (
      <Select
        dataOptions={searchableIndexes}
        id="gokb-search-header-select"
        // label="Search by"
        // name="searchBy"
        onChange={(event) => {
          console.log('Selected search key:', event.target.value);
          setSearchKey(event.target.value);
        }}
        options={[
          { value: 'keyword', label: 'Keyword (Name, Alternative names, Identifiers)' },
          { value: 'nameAndAltNames', label: 'Name and alternative names' },
          { value: 'name', label: 'Name only' },
          { value: 'altName', label: 'Alternative names only' },
          { value: 'identifiers', label: 'Identifiers (all)' },
          { value: 'eisbn', label: 'eISBN' },
          { value: 'pisbn', label: 'pISBN' },
          { value: 'eissn', label: 'eISSN' },
          { value: 'pissn', label: 'pISSN' },
          { value: 'issn', label: 'ISSN' },
          { value: 'isbn', label: 'ISBN' },
          { value: 'ezb', label: 'EZB ID' },
          { value: 'zdb', label: 'ZDB ID' },
          { value: 'uuid', label: 'GOKb UUID' },
          { value: 'gokbId', label: 'GOKb ID' },
          { value: 'authorEditor', label: 'Author/Editor' },
        ]}
        placeholder="Select search field"
        value={searchKey}
      />
    );
  };

  return (
    <SASQRoute
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
