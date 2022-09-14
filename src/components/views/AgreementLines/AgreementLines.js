import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import {
  Button,
  FormattedUTCDate,
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

import { useHandleSubmitSearch } from '@folio/stripes-erm-components';

import AgreementLineFilters from '../../AgreementLineFilters';
import { resultCount } from '../../../constants';
import { urls } from '../../utilities';
import css from '../Agreements.css';
import RouteSwitcher from '../../RouteSwitcher';

const propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    agreementLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    tagsValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  history: PropTypes.object,
  onNeedMoreData: PropTypes.func.isRequired,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
    pending: PropTypes.func
  }),
};

const filterPaneVisibilityKey = '@folio/agreements/agreementLinesFilterPaneVisibility';

const AgreementLines = ({
  children,
  data = {},
  history,
  onNeedMoreData,
  searchField,
  queryGetter,
  querySetter,
  searchString = '',
  selectedRecordId,
  source,
}) => {
  const count = source?.totalCount() ?? 0;
  const query = queryGetter() ?? {};
  const sortOrder = query.sort ?? '';

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(storedFilterPaneVisibility);
  const { handleSubmitSearch, resultsPaneTitleRef } = useHandleSubmitSearch(source);

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };

  return (
    <div data-testid="agreementLines">
      <SearchAndSortQuery
        initialFilterState={{}}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        sortableColumns={['name']}
        syncToLocationSearch
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
                  id="agreementLines-paneset"
                >
                  {filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      id="pane-agreementLines-search"
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
                                className={css.searchField}
                                id="input-agreementLine-search"
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
                            id="clickable-search-agreementLines"
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
                        <AgreementLineFilters
                          activeFilters={activeFilters.state}
                          data={data}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane>
                  }
                  <Pane
                    appIcon={<AppIcon app="agreements" size="small" />}
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
                    id="pane-agreementLine-list"
                    noOverflow
                    padContent={false}
                    paneSub={
                      source?.loaded() ?
                        <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count: source.totalCount() }} />
                        :
                        <FormattedMessage id="stripes-smart-components.searchCriteria" />
                    }
                    paneTitle={<FormattedMessage id="ui-agreements.agreementLines" />}
                    paneTitleRef={resultsPaneTitleRef}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={{
                        name: <FormattedMessage id="ui-agreements.agreementLines.nameReference" />,
                        activeFrom: <FormattedMessage id="ui-agreements.agreementLines.activeFrom" />,
                        note: <FormattedMessage id="ui-agreements.agreementLines.note" />,
                        description: <FormattedMessage id="ui-agreements.agreementLines.description" />,
                        activeTo: <FormattedMessage id="ui-agreements.agreementLines.activeTo" />,
                      }}
                      columnWidths={{
                        name: 300,
                        description: 200,
                        note: 200,
                        activeFrom: 150,
                        activeTo: 150,
                      }}
                      contentData={data.agreementLines}
                      formatter={{
                        name: line => {
                          if (line.type === 'detached') return '';
                          let output;
                          if (line.type === 'external') {
                            output = line.reference;
                          } else {
                            output = line.resource?.name;
                          }
                          return (
                            <AppIcon
                              app="agreements"
                              iconAlignment="baseline"
                              size="small"
                            >
                              {output}
                            </AppIcon>
                          );
                        },
                        note: line => <div style={{ overflowWrap: 'break-word', maxWidth: 250, whiteSpace: 'pre-wrap' }}>{line.note}</div>,
                        activeFrom: line => (line.activeFrom ? <FormattedUTCDate value={line.activeFrom} /> : ''),
                        activeTo: line => (line.activeTo ? <FormattedUTCDate value={line.activeTo} /> : ''),
                      }}
                      hasMargin
                      id="list-agreementLines"
                      isEmptyMessage={
                        source ? (
                          <SearchAndSortNoResultsMessage
                            filterPaneIsVisible
                            searchTerm={query.query ?? ''}
                            source={source}
                            toggleFilterPane={toggleFilterPane}
                          />
                        ) : '...'
                      }
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={(_e, row) => {
                        history.push(`${urls.agreementLineNativeView(row.owner.id, row.id)}${searchString}`);
                      }}
                      pageAmount={resultCount.RESULT_COUNT_INCREMENT}
                      pagingType="click"
                      rowProps={{
                        labelStrings: ({ rowData }) => ([rowData.name]),
                      }}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={[
                        'name',
                        'description',
                        'note',
                        'activeFrom',
                        'activeTo',
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

AgreementLines.propTypes = propTypes;

export default AgreementLines;
