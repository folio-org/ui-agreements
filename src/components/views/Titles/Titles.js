import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
} from '@folio/stripes/components';

import { AppIcon, useStripes } from '@folio/stripes/core';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
  SearchAndSortNoResultsMessage,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import {
  getResourceIdentifier,
  getSiblingIdentifier,
  EResourceType,
  useHandleSubmitSearch,
  usePrevNextPagination,
  SearchKeyControl,
  useSASQQIndex
} from '@folio/stripes-erm-components';
import TitleFilters from '../../TitleFilters';
import IdentifierReassignmentForm from '../../IdentifierReassignmentForm';

import { urls } from '../../utilities';
import {
  KB_TAB_FILTER_PANE,
  KB_TAB_PANESET,
  KB_TAB_PANE_ID,
  resultCount
} from '../../../constants';

import css from '../Agreements.css';
import RouteSwitcher from '../../RouteSwitcher';

const propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    titles: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
  }),
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func
  }),
};

const filterPaneVisibilityKey = '@folio/agreements/eresourcesFilterPaneVisibility';
const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const Titles = ({
  children,
  data = {},
  queryGetter,
  querySetter,
  searchField,
  searchString,
  selectedRecordId,
  source
}) => {
  const count = source?.totalCount() ?? 0;
  const query = queryGetter() ?? {};
  const sortOrder = query.sort ?? '';

  const {
    paginationMCLProps,
    paginationSASQProps
  } = usePrevNextPagination({
    count,
    pageSize: RESULT_COUNT_INCREMENT_MEDIUM
  });

  const {
    qIndexChanged,
    qIndexSASQProps
  } = useSASQQIndex();

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(storedFilterPaneVisibility);
  const { handleSubmitSearch, resultsPaneTitleRef } = useHandleSubmitSearch(source);
  const [moveIdentifiersModal, setMoveIdentifiersModal] = useState(false);

  const stripes = useStripes();
  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };

  return (
    <div data-test-titles data-testid="titles">
      <SearchAndSortQuery
        {...qIndexSASQProps}
        {...paginationSASQProps}
        initialFilterState={{}}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        sortableColumns={['name', 'publicationType']}
      >
        {
          ({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            getFilterHandlers,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll,
          }) => {
            const disableReset = () => (!filterChanged && !searchChanged && !qIndexChanged);
            const filterCount = activeFilters.string ? activeFilters.string.split(',').length : 0;

            const getActionMenu = () => {
              const button = [];
              if (stripes.hasPerm('ui-agreements.resources.edit')) {
                button.push(
                  <Button
                    key="clickable-move-identifier"
                    buttonStyle="dropdownItem"
                    id="clickable-move-identifier"
                    onClick={() => setMoveIdentifiersModal(true)}
                  >
                    <Icon icon="arrow-right" iconPosition="end" />
                    <FormattedMessage id="ui-agreements.eresource.moveIdentifier" />
                  </Button>
                );
              }
              return button.length ? button : null;
            };

            return (
              <PersistedPaneset
                appId="@folio/agreements"
                id={KB_TAB_PANESET}
              >
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="20%"
                    id={KB_TAB_FILTER_PANE}
                    lastMenu={
                      <PaneMenu>
                        <CollapseFilterPaneButton onClick={toggleFilterPane} />
                      </PaneMenu>
                    }
                    paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                  >
                    <form onSubmit={(e) => handleSubmitSearch(e, onSubmitSearch)}>
                      <RouteSwitcher primary="titles" />
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-agreements.agreements.searchInputLabel">
                          {([ariaLabel]) => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              className={css.searchField}
                              data-test-title-search-input
                              id="input-title-search"
                              inputRef={searchField}
                              marginBottom0
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                          )}
                        </FormattedMessage>
                        {/* The options here reflect the constant defaultQIndex */}
                        <SearchKeyControl
                          options={[
                            {
                              label: <FormattedMessage id="ui-agreements.titles.name" />,
                              key: 'name'
                            },
                            {
                              label: <FormattedMessage id="ui-agreements.titles.identifiers" />,
                              key: 'identifiers.identifier.value',
                            },
                            {
                              label: <FormattedMessage id="ui-agreements.titles.alternateResourceName" />,
                              key: 'alternateResourceNames.name'
                            },
                            {
                              label: <FormattedMessage id="ui-agreements.titles.description" />,
                              key: 'description'
                            },
                          ]}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={!searchValue.query || searchValue.query === ''}
                          fullWidth
                          id="clickable-search-titles"
                          marginBottom0
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <div className={css.resetButtonWrap}>
                        <Button
                          buttonStyle="none"
                          disabled={disableReset()}
                          id="clickable-reset-all"
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                      </div>
                      <TitleFilters
                        activeFilters={activeFilters.state}
                        data={data}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }

                <Pane
                  actionMenu={getActionMenu}
                  appIcon={<AppIcon app="agreements" iconKey="title" size="small" />}
                  defaultWidth="fill"
                  firstMenu={
                    !filterPaneIsVisible ?
                      (
                        <PaneMenu>
                          <ExpandFilterPaneButton
                            filterCount={filterCount}
                            onClick={toggleFilterPane}
                          />
                        </PaneMenu>
                      )
                      :
                      null
                  }
                  id={KB_TAB_PANE_ID}
                  noOverflow
                  padContent={false}
                  paneSub={
                    source?.loaded() ?
                      <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count: source.totalCount() }} />
                      :
                      <FormattedMessage id="stripes-smart-components.searchCriteria" />
                  }
                  paneTitle={<FormattedMessage id="ui-agreements.eresources.titles" />}
                  paneTitleRef={resultsPaneTitleRef}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      name: <FormattedMessage id="ui-agreements.eresources.name" />,
                      publicationType: <FormattedMessage id="ui-agreements.eresources.publicationType" />,
                      isbn: <FormattedMessage id="ui-agreements.identifier.isbn" />,
                      eissn: <FormattedMessage id="ui-agreements.identifier.eissn" />,
                      pissn: <FormattedMessage id="ui-agreements.identifier.pissn" />,
                    }}
                    columnWidths={{
                      name: 300,
                      publicationType: 100,
                      isbn: 150,
                      eissn: 150,
                      pissn: 150,
                    }}
                    contentData={data.titles}
                    formatter={{
                      name: e => {
                        return (
                          <AppIcon
                            app="agreements"
                            iconAlignment="baseline"
                            iconKey="title"
                            size="small"
                          >
                            {e?.longName ?? e.name}
                          </AppIcon>
                        );
                      },
                      publicationType: e => <EResourceType resource={e} />,
                      isbn: e => getResourceIdentifier(e, 'isbn'),
                      eissn: e => getResourceIdentifier(e, 'eissn') ?? getResourceIdentifier(e, 'issn'),
                      pissn: e => getResourceIdentifier(e, 'pissn') ?? getSiblingIdentifier(e, 'issn'),
                    }}
                    id="list-titles"
                    isEmptyMessage={
                      source ? (
                        <div data-test-eresources-no-results-message>
                          <SearchAndSortNoResultsMessage
                            filterPaneIsVisible
                            searchTerm={query.query ?? ''}
                            source={source}
                            toggleFilterPane={toggleFilterPane}
                          />
                        </div>
                      ) : '...'
                    }
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    {...paginationMCLProps}
                    rowProps={{
                      labelStrings: ({ rowData }) => [rowData.name],
                      to: id => `${urls.titleView(id)}${searchString}`,
                    }}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    visibleColumns={['name', 'publicationType', 'isbn', 'eissn', 'pissn']}
                  />
                </Pane>
                {children}
              </PersistedPaneset>
            );
          }
        }
      </SearchAndSortQuery>
      <IdentifierReassignmentForm
        onClose={() => setMoveIdentifiersModal(false)}
        open={moveIdentifiersModal}
      />
    </div>
  );
};

Titles.propTypes = propTypes;
export default Titles;
