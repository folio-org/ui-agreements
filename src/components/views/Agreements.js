import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { get, noop } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
  FormattedUTCDate,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';

import { AppIcon, IfPermission } from '@folio/stripes/core';

import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import { statuses } from '../../constants';
import AgreementFilters from '../AgreementFilters';
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
    selectedRecordId: PropTypes.string,
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
    startDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodStart" />,
    endDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodEnd" />,
    cancellationDeadline: <FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />,
  }

  columnWidths = {
    name: 500,
    agreementStatus: 150,
    startDate: 120,
    endDate: 120,
    cancellationDeadline: 120,
  }

  formatter = {
    name: a => {
      const iconKey = get(a, 'agreementStatus.value') === statuses.CLOSED ? 'closedAgreement' : 'app';
      return (
        <AppIcon
          app="agreements"
          iconAlignment="baseline"
          iconKey={iconKey}
          size="small"
        >
          <div style={{ overflowWrap: 'break-word', width: 460 }}>
            {a.name}
          </div>
        </AppIcon>
      );
    },
    agreementStatus: a => get(a, 'agreementStatus.label'),
    startDate: a => (a.startDate ? <FormattedUTCDate value={a.startDate} /> : ''),
    endDate: a => (a.endDate ? <FormattedUTCDate value={a.endDate} /> : ''),
    cancellationDeadline: a => (a.cancellationDeadline ? <FormattedUTCDate value={a.cancellationDeadline} /> : ''),
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
        key={`row-${rowIndex}`}
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
          this.formatter.agreementStatus(rowData),
        ].join('...')}
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
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={source}
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
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
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
      selectedRecordId,
      source,
      syncToLocationSearch,
      visibleColumns,
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    return (
      <div ref={contentRef} data-test-agreements>
        <SearchAndSortQuery
          initialFilterState={{
            agreementStatus: ['Active', 'Draft', 'In negotiation', 'Requested']
          }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'name' }}
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
                      id="pane-agreement-search"
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
                            disabled={disableReset()}
                            id="clickable-reset-all"
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
                    id="pane-agreement-list"
                    lastMenu={this.renderResultsLastMenu()}
                    noOverflow
                    padContent={false}
                    paneSub={this.renderResultsPaneSubtitle(source)}
                    paneTitle={<FormattedMessage id="ui-agreements.agreements" />}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data.agreements}
                      formatter={this.formatter}
                      hasMargin
                      id="list-agreements"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      isSelected={({ item }) => item.id === selectedRecordId}
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
