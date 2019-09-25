import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { get, noop } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  ButtonGroup,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import { AppIcon, IfPermission } from '@folio/stripes/core';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import AgreementFilters from '../AgreementFilters';
import FormattedUTCDate from '../FormattedUTCDate';
import IfEResourcesEnabled from '../IfEResourcesEnabled';
import { urls } from '../utilities';
import css from './Agreements.css';

export default class Agreements extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    contentRef: PropTypes.object,
    data: PropTypes.shape({
      agreements: PropTypes.array.isRequired,
      agreementStatusValues: PropTypes.array.isRequired,
      renewalPriorityValues: PropTypes.array.isRequired,
      isPerpetualValues: PropTypes.array.isRequired,
      orgRoleValues: PropTypes.array.isRequired,
      tagsValues: PropTypes.array.isRequired,
    }),
    disableRecordCreation: PropTypes.bool,
    onNeedMoreData: PropTypes.func.isRequired,
    onSelectRow: PropTypes.func,
    queryGetter: PropTypes.func.isRequired,
    querySetter: PropTypes.func.isRequired,
    searchString: PropTypes.string,
    source: PropTypes.shape({
      loaded: PropTypes.func,
      totalCount: PropTypes.func,
    }),
    syncToLocationSearch: PropTypes.bool,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    data: {},
    searchString: '',
    syncToLocationSearch: true,
    visibleColumns: [
      'name',
      'agreementStatus',
      'startDate',
      'endDate',
      'cancellationDeadline'
    ],
  }

  state = {
    filterPaneIsVisible: true,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.agreements.name" />,
    agreementStatus: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
    startDate: <FormattedMessage id="ui-agreements.agreementPeriods.currentStartDate" />,
    endDate: <FormattedMessage id="ui-agreements.agreementPeriods.currentEndDate" />,
    cancellationDeadline: <FormattedMessage id="ui-agreements.agreementPeriods.currentCancellationDeadline" />,
  }

  columnWidths = {
    name: 300,
    agreementStatus: 150,
    startDate: 120,
    endDate: 120,
    cancellationDeadline: 120,
  }

  formatter = {
    agreementStatus: a => get(a, 'agreementStatus.label'),
    startDate: a => a.currentPeriod.startDate && <FormattedUTCDate value={a.currentPeriod.startDate} />,
    endDate: a => a.currentPeriod.endDate && <FormattedUTCDate value={a.currentPeriod.endDate} />,
    cancellationDeadline: a => a.currentPeriod.cancellationDeadline && <FormattedUTCDate value={a.currentPeriod.cancellationDeadline} />,
  }

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (this.props.onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = this.rowURL(rowData.id);
    }

    return (
      <RowComponent
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
          this.formatter.agreementStatus(rowData),
        ].join('...')}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </RowComponent>
    );
  }

  rowURL = (id) => {
    return `${urls.agreementView(id)}${this.props.searchString}`;
  }

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-agreements-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  }

  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderResultsPaneSubtitle = (source) => {
    if (source && source.loaded()) {
      const count = source.totalCount();
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  renderResultsLastMenu() {
    if (this.props.disableRecordCreation) {
      return null;
    }

    return (
      <IfPermission perm="ui-agreements.agreements.edit">
        <PaneMenu>
          <FormattedMessage id="ui-agreements.agreements.createAgreement">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-agreement"
                marginBottom0
                to={`${urls.agreementCreate()}${this.props.searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  render() {
    const {
      children,
      contentRef,
      data,
      onNeedMoreData,
      onSelectRow,
      queryGetter,
      querySetter,
      source,
      syncToLocationSearch,
      visibleColumns,
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    return (
      <div data-test-agreements ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{
            agreementStatus: ['Active', 'Draft', 'In negotiation', 'Requested']
          }}
          initialSortState={{ sort: 'name' }}
          initialSearchState={{ query: '' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch={syncToLocationSearch}
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

              return (
                <Paneset id="agreements-paneset">
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        <IfEResourcesEnabled>
                          <ButtonGroup fullWidth>
                            <Button
                              buttonStyle="primary"
                              id="clickable-nav-agreements"
                            >
                              <FormattedMessage id="ui-agreements.agreements" />
                            </Button>
                            <Button
                              id="clickable-nav-eresources"
                              to={urls.eresources()}
                            >
                              <FormattedMessage id="ui-agreements.eresources" />
                            </Button>
                          </ButtonGroup>
                        </IfEResourcesEnabled>
                        {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                        <div className={css.searchGroupWrap}>
                          <FormattedMessage id="ui-agreements.agreements.searchInputLabel">
                            {ariaLabel => (
                              <SearchField
                                aria-label={ariaLabel}
                                autoFocus
                                className={css.searchField}
                                data-test-agreement-search-input
                                id="input-agreement-search"
                                inputRef={this.searchField}
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
                            id="clickable-search-agreements"
                            marginBottom0
                            type="submit"
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                        <div className={css.resetButtonWrap}>
                          <Button
                            buttonStyle="none"
                            id="clickable-reset-all"
                            disabled={disableReset()}
                            onClick={resetAll}
                          >
                            <Icon icon="times-circle-solid">
                              <FormattedMessage id="stripes-smart-components.resetAll" />
                            </Icon>
                          </Button>
                        </div>
                        <AgreementFilters
                          activeFilters={activeFilters.state}
                          data={data}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane>
                  }
                  <Pane
                    appIcon={<AppIcon app="agreements" />}
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    lastMenu={this.renderResultsLastMenu()}
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-agreements.agreements" />}
                    paneSub={this.renderResultsPaneSubtitle(source)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data.agreements}
                      formatter={this.formatter}
                      id="list-agreements"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      rowFormatter={this.rowFormatter}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={visibleColumns}
                    />
                  </Pane>
                  {children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}
