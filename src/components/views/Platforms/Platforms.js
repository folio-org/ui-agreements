import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  SearchField,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
  SearchAndSortNoResultsMessage,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import { useHandleSubmitSearch, usePrevNextPagination } from '@folio/stripes-erm-components';

import { urls } from '../../utilities';
import css from '../Agreements.css';
import RouteSwitcher from '../../RouteSwitcher';
import {
  KB_TAB_FILTER_PANE,
  KB_TAB_PANESET,
  KB_TAB_PANE_ID,
  resultCount
} from '../../../constants';

const propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    platforms: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
  }),
};

const filterPaneVisibilityKey = '@folio/platforms/platformsFilterPaneVisibility';
const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const Platforms = ({
  children,
  data = {},
  queryGetter,
  querySetter,
  searchString = '',
  selectedRecordId,
  source,
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

  const searchField = useRef(null);

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);

  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(storedFilterPaneVisibility);
  const { handleSubmitSearch, resultsPaneTitleRef } = useHandleSubmitSearch(source);

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };

  return (
    <div data-test-platforms data-testid="platforms">
      <SearchAndSortQuery
        {...paginationSASQProps}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        syncToLocationSearch
      >
        {
          ({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll,
          }) => {
            const disableReset = () => (!filterChanged && !searchChanged);
            const filterCount = activeFilters.string ? activeFilters.string.split(',').length : 0;

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
                      <RouteSwitcher />
                      {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-agreements.agreements.searchInputLabel">
                          {([ariaLabel]) => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              className={css.searchField}
                              data-test-platform-search-input
                              id="input-platform-search"
                              inputRef={searchField}
                              marginBottom0
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                          )}
                        </FormattedMessage>
                        <Button
                          buttonStyle="primary"
                          disabled={!searchValue.query || searchValue.query === ''}
                          fullWidth
                          id="clickable-search-platforms"
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
                    </form>
                  </Pane>
                }
                <Pane
                  appIcon={<AppIcon app="agreements" iconKey="platform" />}
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
                  paneTitle={<FormattedMessage id="ui-agreements.platforms" />}
                  paneTitleRef={resultsPaneTitleRef}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      name: <FormattedMessage id="ui-agreements.agreements.name" />,
                    }}
                    contentData={data.platforms}
                    formatter={{
                      name: a => {
                        return (
                          <AppIcon
                            app="agreements"
                            iconAlignment="baseline"
                            iconKey="platform"
                            size="small"
                          >
                            <div style={{ overflowWrap: 'break-word', width: 460 }}>
                              {a.name}
                            </div>
                          </AppIcon>
                        );
                      },
                    }}
                    hasMargin
                    id="list-platforms"
                    isEmptyMessage={
                      source ? (
                        <div data-test-platforms-no-results-message>
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
                      to: id => `${urls.platformView(id)}${searchString}`,
                      labelStrings: ({ rowData }) => ([rowData.name, rowData.agreementStatus?.label]),
                    }}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    visibleColumns={[
                      'name',
                    ]}
                  />
                </Pane>
                {children}
              </PersistedPaneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

Platforms.propTypes = propTypes;

export default Platforms;
