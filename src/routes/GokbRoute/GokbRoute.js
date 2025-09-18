import { FormattedMessage } from 'react-intl';

import kyImport from 'ky';

import { AppIcon } from '@folio/stripes/core';

import {
  ColumnManagerMenu,
  useColumnManager,
} from '@folio/stripes/smart-components';

import { SASQRoute } from '@k-int/stripes-kint-components';
import RemoteKbResource from '../../components/views/RemoteKbResource';

import config from '../../../docs/gokb-search-v1';
import archesjsonblob from '../../../docs/archesjsonblob';

import { searchConfigTypeHandler } from '../utilities/adjustments/searchConfigConstructor';

import getResultsDisplayConfig from '../utilities/getResultsDisplayConfig';

import RemoteKbFilters from '../../components/RemoteKbFilters';
import {
  getFilterConfig,
  transformFilterString,
} from '../../components/utilities';
import getSortConfig from '../utilities/getSortConfig';

const GokbRoute = () => {
  const kbKey = 'gokb';
  const columnsConfig = config.configuration.results.display.columns;
  const displayConfig = config.configuration.view.display;
  const filterConfig = getFilterConfig(config);
  const { filterMap, initialFilterState } = filterConfig;

  const resourcePath = config.configuration.view.fetch.mapping.data;
  const resourceEndpoint = config.configuration.view.fetch.baseUrl;

  const endpointData = {
    endpoint: config.configuration.results.fetch.baseUrl,
    ...config.configuration.results.fetch.mapping,
  };

  const FilterComponent = (props) => (
    <RemoteKbFilters {...props} filterConfig={filterConfig} kbKey={kbKey} />
  );

  const ViewComponent = (props) => (
    <RemoteKbResource {...props} displayConfig={displayConfig} />
  );

  const { formatter, resultColumns, sortableColumns } = getResultsDisplayConfig(
    columnsConfig,
    { iconKey: displayConfig.icon }
  );

  const fetchParameters = {
    endpoint: endpointData.endpoint,
    itemEndpoint: resourceEndpoint,
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
        const blob = archesjsonblob;
        const transformedData = {
          ...data,
          totalRecords: data?.[endpointData.totalRecords],
          results: blob?.['ldp:contains'],
        };
        return transformedData;
      }}
      mainPaneProps={{
        actionMenu: renderActionMenu,
        appIcon: (
          <AppIcon app="agreements" iconKey={displayConfig.icon} size="small" />
        ),
        id: `${kbKey}-search-main-pane`,
        paneTitle: <FormattedMessage id="ui-agreements.remoteKb.gokbTitles" />,
      }}
      mclProps={{
        columnWidths: { publicationDates: 300 },
        formatter,
        visibleColumns,
      }}
      path={`/erm/${kbKey}`}
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
      ViewComponent={ViewComponent}
      viewQueryPromise={({ _ky, resourceId, endpoint }) => {
        return kyImport
          .get(
            'https://arcade-test.lincoln.gov.uk/resources/00390606-29b9-435d-8fa6-347b6931719a?format=json'
          )
          .json();
      }}
      viewResponseTransform={(data) => {
        return {
          displaydescription:
            'Observation of groundworks involved with structural repair, including underpinning. No archaeological deposits were observed.',
          displayname: 'Watching Brief at Spring Hill',
          graph_id: 'b9e0701e-5463-11e9-b5f5-000d3ab1e588',
          legacyid: "{'en': {'direction': 'ltr', 'value': 'E5522'}}",
          map_popup:
            'Observation of groundworks involved with structural repair, including underpinning. No archaeological deposits were observed.',
          resource: {
            'Activity Descriptions': [
              {
                'Activity Description':
                  'Observation of groundworks involved with structural repair, including underpinning. No archaeological deposits were observed.',
                'Activity Description Type': {
                  '@value': 'Summary',
                  'Activity Description Metatype': '',
                },
              },
            ],
            'Activity Names': [
              {
                'Activity Name': 'Watching Brief at Spring Hill',
                'Activity Name Currency': {
                  '@value': '',
                  'Activity Name Currency Metatype': '',
                },
                'Activity Name Type': {
                  '@value': 'Primary',
                  'Activity Name Metatype': '',
                },
                'Activity Name Use Type': {
                  '@value': '',
                  'Activity Name Use Metatype': '',
                },
              },
            ],
            'Activity Timespan': {
              'Activity Date Qualifier': {
                '@value': '',
                'Activity Date Qualifier Metatype': '',
              },
              'Activity End Date': '2000-09-18',
              'Activity Start Date': '2000-09-18',
              'Display Date': null,
            },
            'Activity Type': {
              '@value': 'Watching Brief',
              'Activity Metatype': '',
            },
            'Associated Monuments and Areas': 'Castle Mount, Spring Hill',
            'Bibliographic Source Citation': [
              {
                '@value':
                  'Voluntary Observations of interventions by staff of the Heritage Team, Lincoln City Council.',
                Figures: {
                  'Figs.': null,
                  'Figures Type': {
                    '@value': '',
                    'Figures Metatype': '',
                  },
                },
                Pages: {
                  'Page(s)': null,
                  'Pages Type': {
                    '@value': '',
                    'Pages Metatype': '',
                  },
                },
                Plates: {
                  'Plate(s)': null,
                  'Plates Type': {
                    '@value': '',
                    'Plates metatype': '',
                  },
                },
                'Source Comment': {
                  Comment: null,
                  'Source Comment Type': {
                    '@value': '',
                    'Source Comment Metatype': '',
                  },
                },
                'Source Number': {
                  'Source Number Type': {
                    '@value': '',
                    'Source Number Metatype': '',
                  },
                  'Source Number Value': null,
                },
              },
            ],
            'Location Data': {
              Geometry: {
                'Feature Shape': {
                  '@value': '',
                  'Feature Shape Metatype': '',
                },
                'Geospatial Coordinates':
                  "{'type': 'FeatureCollection', 'features': [{'id': '9fb04cd3-e6ca-4a42-b8bd-667c27e758b5', 'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [-0.542554016810026, 53.2337139891952]}, 'properties': {}}]}",
              },
            },
            'System Reference Numbers': {
              LegacyID: {
                'Legacy ID': 'E5522',
                'Legacy ID Type': {
                  '@value': '',
                  'Legacy ID Metatype': '',
                },
              },
              PrimaryReferenceNumber: {
                'Primary Reference Number': '1131',
                'Primary Reference Number Type': {
                  '@value': '',
                  'Primary Reference Number Metatype': '',
                },
              },
              UUID: {
                ResourceID: '000543e8-bfea-40b3-8325-010981f2369e',
                'ResourceID Type': {
                  '@value': '',
                  'ResourceID Metatype': '',
                },
              },
            },
          },
          resourceinstanceid: '000543e8-bfea-40b3-8325-010981f2369e',
        };
      }}
    />
  );
};

export default GokbRoute;
