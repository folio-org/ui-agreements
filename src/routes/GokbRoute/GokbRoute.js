import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import kyImport from 'ky';

import { JSONPath } from 'jsonpath-plus';

import handlebars from 'handlebars';

import { ColumnManagerMenu, useColumnManager } from '@folio/stripes/smart-components';

import { SASQRoute } from '@k-int/stripes-kint-components';

import gokbConfig from '../../../docs/gokb-search-v1';

const GokbRoute = ({ location }) => {
  const fetchParameters = {
    endpoint: 'https://gokbt.gbv.de/gokb/rest/titles',
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

  // When building the SASQ from the config file, using the results.display values
  // should construct a formatter and resultColumns object

  const resultColumns = gokbConfig.configuration.results.display.columns.map(col => ({
    propertyPath: col.name,
    label: <FormattedMessage id={`ui-agreements.gokb.${col.name}`} />
  }));

  console.log('resultColumns', resultColumns);

  // EXAMPLE: Using JSONPath to format the results
  // const formatter = {
  //   name: (resource) => JSONPath({ path: '$.name', json: resource }),
  // };

  const stringFormatter = Object.fromEntries(
    gokbConfig.configuration.results.display.columns
      .filter(col => col.type === 'String' && col.name && col.value?.expression)
      .map(col => [
        col.name,
        (resource) => JSONPath({ path: col.value.expression, json: resource })
      ])
  );

  const arrayFormatter = Object.fromEntries(
    gokbConfig.configuration.results.display.columns
      .filter(col => col.type === 'Array' && col.name && col.value?.expression)
      .map(col => [
        col.name,
        (resource) => {
          const result = JSONPath({ path: col.value.expression, json: resource });
          // console.log(`formatter[${col.name}]`, result);
          return col.joinStrategy === 'Comma'
            ? (result || []).filter(Boolean).join(', ')
            : result;
        }
      ])

  );

  const formatter = {
    ...stringFormatter,
    ...arrayFormatter
  };

  console.log('formatter', formatter);

  const columnMapping = resultColumns?.length
    ? Object.fromEntries(resultColumns.map(col => [col.propertyPath, col.label]))
    : {};

  console.log('columnMapping', columnMapping);
  const { visibleColumns, toggleColumn } = useColumnManager('gokb-search-list-column-manager', columnMapping);

  console.log('visibleColumns', visibleColumns);
  const renderActionMenu = () => {
    return (
      <ColumnManagerMenu
        columnMapping={columnMapping}
        excludeColumns={['name']}
        prefix="gokb-search-list"
        toggleColumn={toggleColumn}
        visibleColumns={visibleColumns}
      />
    );
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
        actionMenu: renderActionMenu,
        id: 'gokb-search-main-pane',
        paneTitle: <FormattedMessage id="ui-agreements.gokb" />,
      }}
      mclProps={{
        formatter,
        visibleColumns
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
