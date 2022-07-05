import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

// FIXME DO NOT MERGE THIS
import { CycleButton } from '@k-int/stripes-kint-components';

// FIXME DO NOT MERGE THIS
import { NumberGeneratorModalButton, NumberGeneratorButton, NumberGeneratorModal, useGenerateNumber } from '@folio/service-interaction';

import {
  Button,
  ButtonGroup,
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
  ExpandFilterPaneButton,
  PersistedPaneset,
  SearchAndSortNoResultsMessage,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';
import { useHandleSubmitSearch } from '@folio/stripes-erm-components';

import { statuses } from '../../../constants';
import AgreementFilters from '../../AgreementFilters';
import IfEResourcesEnabled from '../../IfEResourcesEnabled';
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

const filterPaneVisibilityKey = '@folio/agreements/agreementsFilterPaneVisibility';

const Agreements = ({
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
  const [numberGenOpen, setNumberGenOpen] = useState(false);

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
    writeStorage(filterPaneVisibilityKey, !filterPaneIsVisible);
  };

  const { generate } = useGenerateNumber({
    generator: 'UserBarcode',
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

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <div data-test-agreements data-testid="agreements">
        <SearchAndSortQuery
          initialFilterState={{
            agreementStatus: ['active', 'draft', 'in_negotiation', 'requested']
          }}
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
                  id="agreements-paneset"
                >
                  {filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      id="pane-agreement-search"
                      lastMenu={
                        <PaneMenu>
                          <CollapseFilterPaneButton onClick={toggleFilterPane} />
                        </PaneMenu>
                      }
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={(e) => handleSubmitSearch(e, onSubmitSearch)}>
                        <IfEResourcesEnabled>
                          <ButtonGroup fullWidth>
                            <Button
                              buttonStyle="primary"
                              id="clickable-nav-agreements"
                            >
                              <FormattedMessage id="ui-agreements.agreements" />
                            </Button>
                            <IfPermission perm="ui-agreements.resources.view">
                              <Button
                                id="clickable-nav-eresources"
                                to={urls.eresources()}
                              >
                                <FormattedMessage id="ui-agreements.eresources" />
                              </Button>
                            </IfPermission>
                            <IfPermission perm="ui-agreements.platforms.view">
                              <Button
                                id="clickable-nav-platforms"
                                to={urls.platforms()}
                              >
                                <FormattedMessage id="ui-agreements.platforms" />
                              </Button>
                            </IfPermission>
                          </ButtonGroup>
                        </IfEResourcesEnabled>
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
                    id="pane-agreement-list"
                    lastMenu={(
                      <IfPermission perm="ui-agreements.agreements.edit">
                        <PaneMenu>
                          <FormattedMessage id="ui-agreements.agreements.createAgreement">
                            {ariaLabel => (
                              <Button
                                aria-label={ariaLabel}
                                buttonStyle="primary"
                                id="clickable-new-agreement"
                                marginBottom0
                                to={`${urls.agreementCreate()}${searchString}`}
                              >
                                <FormattedMessage id="stripes-smart-components.new" />
                              </Button>
                            )}
                          </FormattedMessage>
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
                        </PaneMenu>
                      </IfPermission>
                    )}
                    noOverflow
                    padContent={false}
                    paneSub={
                      source?.loaded() ?
                        <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count: source.totalCount() }} />
                        :
                        <FormattedMessage id="stripes-smart-components.searchCriteria" />
                    }
                    paneTitle={<FormattedMessage id="ui-agreements.agreements" />}
                    paneTitleRef={resultsPaneTitleRef}
                  >
                    {/* FIXME DO NOT MERGE THIS */}
                    <NumberGeneratorModalButton
                      id="agreements-number-generator"
                      callback={(gen) => console.log(gen)}
                      generator={'UserBarcode'}
                    />
                    <NumberGeneratorButton
                      callback={(n) => console.log("SEPARATE BUTTON: %o", n)}
                      generator={'UserBarcode'}
                      sequence={'patron'}
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
                    <MultiColumnList
                      autosize
                      columnMapping={{
                        name: <FormattedMessage id="ui-agreements.agreements.name" />,
                        agreementStatus: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
                        startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
                        endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
                        cancellationDeadline: <FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />,
                      }}
                      columnWidths={{
                        name: 500,
                        agreementStatus: 150,
                        startDate: 120,
                        endDate: 120,
                        cancellationDeadline: 120,
                      }}
                      contentData={data.agreements}
                      formatter={{
                        name: a => {
                          const iconKey = a?.agreementStatus?.value === statuses.CLOSED ? 'closedAgreement' : 'app';
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
                        agreementStatus: a => a?.agreementStatus?.label,
                        startDate: a => (a.startDate ? <FormattedUTCDate value={a.startDate} /> : ''),
                        endDate: a => (a.endDate ? <FormattedUTCDate value={a.endDate} /> : ''),
                        cancellationDeadline: a => (a.cancellationDeadline ? <FormattedUTCDate value={a.cancellationDeadline} /> : ''),
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
                        ) : '...'
                      }
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      rowProps={{
                        to: id => `${urls.agreementView(id)}${searchString}`,
                        labelStrings: ({ rowData }) => ([rowData.name, rowData.agreementStatus?.label]),
                      }}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={[
                        'name',
                        'agreementStatus',
                        'startDate',
                        'endDate',
                        'cancellationDeadline'
                      ]}
                    />
                  </Pane>
                  {children}
                </PersistedPaneset>
              );
            }
          }
        </SearchAndSortQuery>
        <NumberGeneratorModal
          callback={(generated) => {
            console.log(`Number gen through separate modal: ${generated}`);
            setNumberGenOpen(false);
          }}
          label="TESTING LABEL OVERRIDE"
          generator="UserBarcode"
          id="separate-number-gen-modal"
          onClose={() => setNumberGenOpen(false)}
          open={numberGenOpen}
        />
      </div>
    </HasCommand>
  );
};

Agreements.propTypes = propTypes;

export default Agreements;
