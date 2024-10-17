import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

// FIXME DO NOT MERGE THIS
import { CycleButton } from '@k-int/stripes-kint-components';

// FIXME DO NOT MERGE THIS
import { NumberGeneratorModalButton, NumberGeneratorButton, NumberGeneratorModal, useGenerateNumber } from '@folio/service-interaction';

import {
  Button,
  FormattedUTCDate,
  HasCommand,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  SearchField,
  checkScope,
} from '@folio/stripes/components';

import { AppIcon, IfPermission } from '@folio/stripes/core';

import {
  CollapseFilterPaneButton,
  ColumnManagerMenu,
  ExpandFilterPaneButton,
  PersistedPaneset,
  SearchAndSortNoResultsMessage,
  SearchAndSortQuery,
  useColumnManager
} from '@folio/stripes/smart-components';

import {
  SearchKeyControl,
  useHandleSubmitSearch,
  useSASQQIndex,
  usePrevNextPagination,
} from '@folio/stripes-erm-components';

import {
  AGREEMENTS_COLUMN_MAPPING,
  AGREEMENTS_TAB_FILTER_PANE,
  AGREEMENTS_TAB_PANESET,
  AGREEMENTS_TAB_PANE_ID,
  statuses,
  resultCount,
} from '../../../constants';
import AgreementFilters from '../../AgreementFilters';
import RouteSwitcher from '../../RouteSwitcher';

import { urls } from '../../utilities';
import css from '../Agreements.css';

const propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    agreements: PropTypes.arrayOf(PropTypes.object).isRequired,
    agreementStatusValues: PropTypes.arrayOf(PropTypes.object).isRequired,
    isPerpetualValues: PropTypes.arrayOf(PropTypes.object).isRequired,
    orgRoleValues: PropTypes.arrayOf(PropTypes.object).isRequired,
    renewalPriorityValues: PropTypes.arrayOf(PropTypes.object).isRequired,
    tagsValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  history: PropTypes.object,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
    pending: PropTypes.func,
  }),
};

const filterPaneVisibilityKey =
  '@folio/agreements/agreementsFilterPaneVisibility';

const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const Agreements = ({
  children,
  data = {},
  history,
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

  const { paginationMCLProps, paginationSASQProps } = usePrevNextPagination({
    count,
    pageSize: RESULT_COUNT_INCREMENT_MEDIUM,
  });

  const { qIndexChanged, qIndexSASQProps } = useSASQQIndex();

  const [storedFilterPaneVisibility] = useLocalStorage(
    filterPaneVisibilityKey,
    true
  );
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(
    storedFilterPaneVisibility
  );
  const { handleSubmitSearch, resultsPaneTitleRef } =
    useHandleSubmitSearch(source);

  const [numberGenOpen, setNumberGenOpen] = useState(false);

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };

  const { generate } = useGenerateNumber({
    generator: 'Patron',
    sequence: 'patron',
    callback: (num) => console.log("HOMEROLLED: %o", num)
  })

  const goToNew = () => {
    history.push(`${urls.agreementCreate()}${searchString}`);
  };

  const shortcuts = [
    {
      name: 'new',
      handler: goToNew,
    },
  ];

  const { visibleColumns, toggleColumn } = useColumnManager('agreements-list-column-manager', AGREEMENTS_COLUMN_MAPPING);

  const getActionMenu = () => {
    return (
      <>
        <IfPermission perm="ui-agreements.agreements.edit">
          <Button
            buttonStyle="dropdownItem"
            id="clickable-new-agreement"
            onClick={goToNew}
          >
            <Icon icon="plus-sign">
              <FormattedMessage id="stripes-smart-components.new" />
            </Icon>
          </Button>
          <CycleButton
            buttons={[
              {
                icon: "comment",
                onClick: () => console.log("CLICKED BUTTON"),
                className: css.buttonStyle1
              },
              {
                icon: "trash",
                onClick: () => console.log("CLICKED OTHER BUTTON"),
                className: css.buttonStyle2
              }
            ]}
          />
        </IfPermission>
        <ColumnManagerMenu
          columnMapping={AGREEMENTS_COLUMN_MAPPING}
          prefix="agreements-list"
          toggleColumn={toggleColumn}
          visibleColumns={visibleColumns}
        />
      </>
    );
  };
  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <div data-test-agreements data-testid="agreements">
        <SearchAndSortQuery
          {...paginationSASQProps}
          {...qIndexSASQProps}
          initialFilterState={{
            agreementStatus: ['active', 'draft', 'in_negotiation', 'requested'],
          }}
          initialSortState={{ sort: 'name' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch
        >
          {({
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
            const disableReset = () => !filterChanged && !searchChanged && !qIndexChanged;
            const filterCount = activeFilters.string
              ? activeFilters.string.split(',').length
              : 0;
            return (
              <PersistedPaneset
                appId="@folio/agreements"
                id={AGREEMENTS_TAB_PANESET}
              >
                {filterPaneIsVisible && (
                  <Pane
                    defaultWidth="20%"
                    id={AGREEMENTS_TAB_FILTER_PANE}
                    lastMenu={
                      <PaneMenu>
                        <CollapseFilterPaneButton onClick={toggleFilterPane} />
                      </PaneMenu>
                    }
                    paneTitle={
                      <FormattedMessage id="stripes-smart-components.searchAndFilter" />
                    }
                  >
                    <form
                      onSubmit={(e) => handleSubmitSearch(e, onSubmitSearch)}
                    >
                      <RouteSwitcher primary="agreements" />
                      {/* TODO: Use forthcoming <SearchGroup> or similar component */}
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-agreements.agreements.searchInputLabel">
                          {([ariaLabel]) => (
                            <SearchField
                              aria-label={ariaLabel}
                              className={css.searchField}
                              data-test-agreement-search-input
                              id="input-agreement-search"
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
                              label: (
                                <FormattedMessage id="ui-agreements.agreements.name" />
                              ),
                              key: 'name',
                            },
                            {
                              label: (
                                <FormattedMessage id="ui-agreements.alternativeName" />
                              ),
                              key: 'alternateNames.name',
                            },
                            {
                              label: (
                                <FormattedMessage id="ui-agreements.description" />
                              ),
                              key: 'description',
                            },
                          ]}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={
                            !searchValue.query || searchValue.query === ''
                          }
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
                    </form>
                    <AgreementFilters
                      activeFilters={activeFilters.state}
                      data={data}
                      filterHandlers={getFilterHandlers()}
                    />
                  </Pane>
                )}
                <Pane
                  actionMenu={getActionMenu}
                  appIcon={<AppIcon app="agreements" />}
                  defaultWidth="fill"
                  firstMenu={
                    !filterPaneIsVisible ? (
                      <PaneMenu>
                        <ExpandFilterPaneButton
                          filterCount={filterCount}
                          onClick={toggleFilterPane}
                        />
                      </PaneMenu>
                    ) : null
                  }
                  id={AGREEMENTS_TAB_PANE_ID}
                  noOverflow
                  padContent={false}
                  paneSub={
                    source?.loaded() ? (
                      <FormattedMessage
                        id="stripes-smart-components.searchResultsCountHeader"
                        values={{ count: source.totalCount() }}
                      />
                    ) : (
                      <FormattedMessage id="stripes-smart-components.searchCriteria" />
                    )
                  }
                  paneTitle={<FormattedMessage id="ui-agreements.agreements" />}
                  paneTitleRef={resultsPaneTitleRef}
                >
                  {/* FIXME DO NOT MERGE THIS */}
                  <NumberGeneratorModalButton
                    buttonLabel="All generators"
                    callback={(gen) => console.log(gen)}
                    generateButtonLabel="Do the generate"
                    id="agreements-number-generator-all"
                  />
                  <NumberGeneratorModalButton
                    buttonLabel="Patron sequences"
                    callback={(gen) => console.log(gen)}
                    generator="Patron"
                    id="agreements-number-generator"
                  />
                  <NumberGeneratorButton
                    callback={(n) => console.log("SEPARATE BUTTON: %o", n)}
                    generator="Patron"
                    sequence="patron"
                  />
                  <Button
                    onClick={generate}
                  >
                    home rolled gen
                  </Button>
                  <Button
                    onClick={() => setNumberGenOpen(true)}
                  >
                    Open separate NumberGeneratorModal
                  </Button>
                  {/* FIXME DO NOT MERGE THIS (END) */}
                  <MultiColumnList
                    autosize
                    columnMapping={AGREEMENTS_COLUMN_MAPPING}
                    columnWidths={{
                      name: 500,
                      agreementStatus: 150,
                      startDate: 120,
                      endDate: 120,
                      cancellationDeadline: 120,
                      description: 500,
                    }}
                    contentData={data.agreements}
                    formatter={{
                      name: (a) => {
                        const iconKey =
                          a?.agreementStatus?.value === statuses.CLOSED
                            ? 'closedAgreement'
                            : 'app';
                        return (
                          <AppIcon
                            app="agreements"
                            iconAlignment="baseline"
                            iconKey={iconKey}
                            size="small"
                          >
                            <div
                              style={{ overflowWrap: 'break-word', width: 460 }}
                            >
                              {a.name}
                            </div>
                          </AppIcon>
                        );
                      },
                      agreementStatus: (a) => a?.agreementStatus?.label,
                      startDate: (a) => (a.startDate ? (
                        <FormattedUTCDate value={a.startDate} />
                      ) : (
                        ''
                      )),
                      endDate: (a) => (a.endDate ? <FormattedUTCDate value={a.endDate} /> : ''),
                      cancellationDeadline: (a) => (a.cancellationDeadline ? (
                        <FormattedUTCDate value={a.cancellationDeadline} />
                      ) : (
                        ''
                      )),
                    }}
                    hasMargin
                    id="list-agreements"
                    isEmptyMessage={
                      source ? (
                        <div data-test-agreements-no-results-message>
                          <SearchAndSortNoResultsMessage
                            filterPaneIsVisible
                            searchTerm={query.query ?? ''}
                            source={source}
                            toggleFilterPane={toggleFilterPane}
                          />
                        </div>
                      ) : (
                        '...'
                      )
                    }
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    {...paginationMCLProps}
                    rowProps={{
                      to: (id) => `${urls.agreementView(id)}${searchString}`,
                      labelStrings: ({ rowData }) => [
                        rowData.name,
                        rowData.agreementStatus?.label,
                      ],
                    }}
                    sortDirection={
                      sortOrder.startsWith('-') ? 'descending' : 'ascending'
                    }
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    visibleColumns={visibleColumns}
                  />
                </Pane>
                {children}
              </PersistedPaneset>
            );
          }}
        </SearchAndSortQuery>
        <NumberGeneratorModal
          callback={(generated) => {
            console.log(`Number gen through separate modal: ${generated}`);
            setNumberGenOpen(false);
          }}
          generator="Patron"
          id="separate-number-gen-modal"
          label="TESTING LABEL OVERRIDE"
          onClose={() => setNumberGenOpen(false)}
          open={numberGenOpen}
        />
      </div>
    </HasCommand>
  );
};

Agreements.propTypes = propTypes;

export default Agreements;
