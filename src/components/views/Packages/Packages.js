import { useState, useEffect } from 'react';
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
  Checkbox
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
  useHandleSubmitSearch,
  usePrevNextPagination,
} from '@folio/stripes-erm-components';

import EResourceProvider from '../../EResourceProvider';
import PackageFilters from '../../PackageFilters';

import { urls } from '../../utilities';
import {
  KB_TAB_FILTER_PANE,
  KB_TAB_PANESET,
  KB_TAB_PANE_ID,
  resultCount,
  syncStates
} from '../../../constants';

import css from '../Agreements.css';
import RouteSwitcher from '../../RouteSwitcher';


const propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    packages: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  handleSyncPackages: PropTypes.func,
  onSelectPackageIds: PropTypes.func,
};

const filterPaneVisibilityKey = '@folio/agreements/eresourcesFilterPaneVisibility';
const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const Packages = ({
  children,
  data = {},
  queryGetter,
  querySetter,
  searchField,
  searchString,
  selectedRecordId,
  source,
  handleSyncPackages,
  onSelectPackageIds
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

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(storedFilterPaneVisibility);
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);
  const { handleSubmitSearch, resultsPaneTitleRef } = useHandleSubmitSearch(source);

  const stripes = useStripes();

  // Separate effect to call the parent function only when selectedPackageIds changes
  useEffect(() => {
    if (onSelectPackageIds) {
      onSelectPackageIds(selectedPackageIds);
    }
  }, [selectedPackageIds, onSelectPackageIds]);

  const handleCheckboxClick = (e, packageId) => {
    e.stopPropagation();

    const selectedPackageIdIndex = selectedPackageIds.indexOf(packageId);
    if (selectedPackageIdIndex > -1) { // only remove from array when item is found
      setSelectedPackageIds(selectedPackageIds.filter(pid => pid !== packageId)); // 2nd parameter means remove one item only
    } else {
      setSelectedPackageIds([...selectedPackageIds, packageId]);
    }
  };

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };

  const handleToggleSelectAll = () => {
    if (selectedPackageIds.length === (data.packages ? data.packages.length : 0)) {
      setSelectedPackageIds([]);
    } else {
      setSelectedPackageIds(data.packages ? data.packages.map(pkg => pkg.id) : []);
    }
  };

  const getActionMenu = ({ onToggle }) => {
    const buttons = [];

    if (stripes.hasPerm('ui-agreements.packages.controlSync.execute')) {
      buttons.push(
        <Button
          key="clickable-dropdown-sync-package"
          buttonStyle="dropdownItem"
          disabled={selectedPackageIds.length === 0}
          id="clickable-dropdown-sync-package"
          onClick={() => {
            handleSyncPackages(syncStates.SYNCHRONIZING);
            onToggle();
          }}
        >
          <FormattedMessage id="ui-agreements.eresources.startSyncSelectedPackages" />
        </Button>
      );

      buttons.push(
        <Button
          key="clickable-dropdown-pause-package"
          buttonStyle="dropdownItem"
          disabled={selectedPackageIds.length === 0}
          id="clickable-dropdown-pause-package"
          onClick={() => {
            handleSyncPackages(syncStates.PAUSED);
            onToggle();
          }}
        >
          <FormattedMessage id="ui-agreements.eresources.pauseSyncSelectedPackages" />
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  };

  return (
    <div data-testid="packages">
      <SearchAndSortQuery
        {...paginationSASQProps}
        initialFilterState={{}}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
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
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-agreements.agreements.searchInputLabel">
                          {([ariaLabel]) => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              className={css.searchField}
                              data-test-eresource-search-input
                              id="input-package-search"
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
                          id="clickable-search-packages"
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
                      <PackageFilters
                        activeFilters={activeFilters.state}
                        data={data}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }

                <Pane
                  actionMenu={getActionMenu}
                  appIcon={<AppIcon app="agreements" iconKey="package" size="small" />}
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
                  paneTitle={<FormattedMessage id="ui-agreements.packages" />}
                  paneTitleRef={resultsPaneTitleRef}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      select: (
                        <Checkbox
                          /* This assumes that the MCL page includes everything from the fetch, which is the case right now */
                          checked={selectedPackageIds.length === (data.packages ? data.packages.length : 0)}
                          name="select-all"
                          onChange={handleToggleSelectAll}
                        />
                      ),
                      name: <FormattedMessage id="ui-agreements.eresources.name" />,
                      provider: <FormattedMessage id="ui-agreements.eresources.provider" />,
                      source: <FormattedMessage id="ui-agreements.packages.source" />,
                      status: <FormattedMessage id="ui-agreements.eresources.status" />,
                      syncContentsFromSource: <FormattedMessage id="ui-agreements.eresources.synchronisationStatus" />,
                    }}
                    columnWidths={{
                      select: 40,
                      name: 300,
                      provider: 200,
                      source: 250,
                      status: 150,
                      syncContentsFromSource: 200,
                    }}
                    contentData={data.packages}
                    formatter={{
                      select: item => (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedPackageIds.includes(item.id)}
                            name={`select-${item.id}`}
                            onChange={(e) => handleCheckboxClick(e, item.id)}
                          />
                        </div>
                      ),
                      name: e => {
                        return (
                          <AppIcon
                            app="agreements"
                            iconAlignment="baseline"
                            iconKey="package"
                            size="small"
                          >
                            {e._object?.longName ?? e.name}
                          </AppIcon>
                        );
                      },
                      provider: line => <EResourceProvider resource={line.resource || line} />,
                      source: e => (e.source),
                      status: e => (e.lifecycleStatus?.label),
                      syncContentsFromSource: e => { return (e.syncContentsFromSource === true || e.syncContentsFromSource === false) ? <FormattedMessage id={`ui-agreements.eresources.syncStatus.${e.syncContentsFromSource}`} /> : null; },
                    }}
                    id="list-packages"
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
                    nonInteractiveHeaders={['select']}
                    onHeaderClick={onSort}
                    {...paginationMCLProps}
                    rowProps={{
                      labelStrings: ({ rowData }) => [rowData.name],
                      to: id => `${urls.packageView(id)}${searchString}`,
                    }}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    visibleColumns={['select', 'name', 'provider', 'source', 'status', 'syncContentsFromSource']}
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

Packages.propTypes = propTypes;
export default Packages;

