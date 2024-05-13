import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownMenu,
  FormattedUTCDate,
  Headline,
  Icon,
  Layout,
  MultiColumnList,
  NoValue,
  Row,
  Spinner,
  Tooltip,
} from '@folio/stripes/components';

import { AppIcon, useCallout } from '@folio/stripes/core';

import {
  getResourceIdentifier,
  TitleOnPlatformLink,
  usePrevNextPagination,
  useFetchWithNoStats,
} from '@folio/stripes-erm-components';

import { useAgreementsSettings } from '../../../hooks';
import Coverage from '../../Coverage';
import CustomCoverageIcon from '../../CustomCoverageIcon';
import IfEResourcesEnabled from '../../IfEResourcesEnabled';
import {
  resultCount,
  COVERED_ERESOURCES_PAGINATION_ID,
  AGREEMENT_ERESOURCES_ENDPOINT,
} from '../../../constants';
import { urls, parseMclPageSize } from '../../utilities';

const propTypes = {
  agreement: PropTypes.shape({
    id: PropTypes.string,
    lines: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  eresourcesFilterPath: PropTypes.string,
  onFilterEResources: PropTypes.func.isRequired,
  onExportEResourcesAsJSON: PropTypes.func.isRequired,
  onExportEResourcesAsKBART: PropTypes.func.isRequired,
};

const CoveredEResourcesList = ({
  agreement: { id, lines },
  eresourcesFilterPath,
  onFilterEResources,
  onExportEResourcesAsJSON,
  onExportEResourcesAsKBART,
}) => {
  const settings = useAgreementsSettings();
  const coveredEresourcePageSize = parseMclPageSize(
    settings,
    'agreementEresources'
  );
  const agreementEresourcesPath = AGREEMENT_ERESOURCES_ENDPOINT(
    id,
    eresourcesFilterPath
  );

  const { currentPage } = usePrevNextPagination({
    pageSize: coveredEresourcePageSize, // Only needed for reading back MCL props
    id: COVERED_ERESOURCES_PAGINATION_ID,
    syncToLocation: false,
  });

  // AGREEMENT ERESOURCES PER PAGE FETCH WITHOUT STATS / FETCH CURRENT AND NEXT PAGE
  const eresourcesQueryConfig = {
    id: COVERED_ERESOURCES_PAGINATION_ID,
    params: {
      sort: [{ path: 'pti.titleInstance.name' }],
      page: currentPage,
      perPage: coveredEresourcePageSize,
    },
    path: agreementEresourcesPath,
    keyArray: ['ui-agreements', 'AgreementViewRoute', 'getEresources'],
  };

  const {
    currentPage: { data: agreementEresources = [] } = {},
    nextPage = {},
  } = useFetchWithNoStats(eresourcesQueryConfig);

  const hasNextEresourcesPage = nextPage?.data?.length > 0;

  const { paginationMCLProps } = usePrevNextPagination({
    hasNextPage: hasNextEresourcesPage,
    pageSize: coveredEresourcePageSize,
    id: COVERED_ERESOURCES_PAGINATION_ID,
    syncToLocation: false,
  });

  const callout = useCallout();
  const exportDisabled =
    eresourcesFilterPath === 'dropped' || eresourcesFilterPath === 'future';

  const exports = (exportCallback) => {
    const calloutId = callout.sendCallout({
      message: (
        <FormattedMessage id="ui-agreements.eresourcesCovered.preparingExport" />
      ),
      timeout: 0,
    });

    exportCallback().then(() => callout.removeCallout(calloutId));
  };

  const renderDate = (date) => (date ? <FormattedUTCDate value={date} /> : '');

  const renderExportDropdown = (disabled) => (
    <Dropdown
      buttonProps={{
        'data-test-export-button': true,
        disabled,
        marginBottom0: true,
      }}
      label={<FormattedMessage id="ui-agreements.eresourcesCovered.exportAs" />}
    >
      <DropdownMenu role="menu">
        <FormattedMessage id="ui-agreements.eresourcesCovered.exportAsJSON">
          {(exportAsJson) => (
            <Button
              aria-label={exportAsJson}
              buttonStyle="dropdownItem"
              id="clickable-dropdown-export-eresources-json"
              onClick={() => exports(onExportEResourcesAsJSON)}
              role="menuitem"
            >
              <FormattedMessage id="ui-agreements.eresourcesCovered.json" />
            </Button>
          )}
        </FormattedMessage>
        <FormattedMessage id="ui-agreements.eresourcesCovered.exportAsJSON">
          {(exportAsKbart) => (
            <Button
              aria-label={exportAsKbart}
              buttonStyle="dropdownItem"
              id="clickable-dropdown-export-eresources-kbart"
              onClick={() => exports(onExportEResourcesAsKBART)}
              role="menuitem"
            >
              <FormattedMessage id="ui-agreements.eresourcesCovered.kbart" />
            </Button>
          )}
        </FormattedMessage>
      </DropdownMenu>
    </Dropdown>
  );

  const renderFilterButton = (filter) => (
    <Button
      buttonStyle={eresourcesFilterPath === filter ? 'primary' : 'default'}
      id={`clickable-pci-${filter}`}
      marginBottom0
      onClick={() => onFilterEResources(filter)}
    >
      <FormattedMessage id={`ui-agreements.content.${filter}`} />
    </Button>
  );

  const renderFilterButtons = () => (
    <Layout className="textCentered">
      <ButtonGroup>
        {renderFilterButton('current')}
        {renderFilterButton('future')}
        {renderFilterButton('dropped')}
        {renderFilterButton('all')}
      </ButtonGroup>
    </Layout>
  );

  const renderList = () => {
    return (
      <MultiColumnList
        columnMapping={{
          name: <FormattedMessage id="ui-agreements.eresources.name" />,
          issn: <FormattedMessage id="ui-agreements.identifier.eissn.issn" />,
          platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
          package: <FormattedMessage id="ui-agreements.eresources.package" />,
          coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
          isCustomCoverage: ' ',
          accessStart: (
            <FormattedMessage id="ui-agreements.eresources.accessStart" />
          ),
          accessEnd: (
            <FormattedMessage id="ui-agreements.eresources.accessEnd" />
          ),
        }}
        columnWidths={{
          name: 250,
          platform: 150,
          package: 150,
          coverage: { min: 250, max: 320 },
        }}
        contentData={agreementEresources}
        formatter={{
          name: (e) => {
            const titleInstanceName = e?._object?.pti?.titleInstance?.name;
            return (
              <AppIcon
                app="agreements"
                iconAlignment="baseline"
                iconKey="pci"
                size="small"
              >
                <Link to={urls.packageView(e.id)}>{titleInstanceName}</Link>
              </AppIcon>
            );
          },
          issn: (e) => {
            const titleInstance = get(e._object, 'pti.titleInstance', {});
            return (
              getResourceIdentifier(titleInstance, 'issn') ||
              getResourceIdentifier(titleInstance, 'eissn') ||
              getResourceIdentifier(titleInstance, 'pissn')
            );
          },
          platform: (e) => {
            const pti = e?._object?.pti ?? {};
            const { name, platform, url } = pti;

            return (
              <TitleOnPlatformLink
                id={e.id}
                name={name}
                platform={platform?.name}
                url={url}
              />
            );
          },
          package: (e) => e?._object?.pkg?.name ?? <NoValue />,
          coverage: (e) => <Coverage eResource={e} />,
          accessStart: (e) => renderDate(e._object?.accessStart),
          accessEnd: (e) => renderDate(e._object?.accessEnd),
          isCustomCoverage: (line) => {
            if (!line.customCoverage) return '';
            return (
              <Tooltip
                id={`covered-eresources-cc-tooltip-${line.rowIndex}`}
                text={
                  <FormattedMessage id="ui-agreements.customcoverages.tooltip" />
                }
              >
                {({ ref, ariaIds }) => (
                  <CustomCoverageIcon
                    ref={ref}
                    aria-labelledby={ariaIds.text}
                  />
                )}
              </Tooltip>
            );
          },
        }}
        id="eresources-covered"
        interactive={false}
        pageAmount={resultCount.RESULT_COUNT_INCREMENT}
        pagingType="click"
        visibleColumns={[
          'name',
          'issn',
          'platform',
          'package',
          'coverage',
          'isCustomCoverage',
          'accessStart',
          'accessEnd',
        ]}
        {...paginationMCLProps}
      />
    );
  };

  return lines?.length ? (
    <IfEResourcesEnabled>
      <Layout className="marginTop1">
        <Headline margin="small" tag="h4">
          <FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />
        </Headline>
      </Layout>
      <Row end="xs">
        <Col md={9} xs={12}>
          {renderFilterButtons()}
        </Col>
        <Col md={3} xs={12}>
          {renderExportDropdown(exportDisabled)}
          {exportDisabled ? (
            <Tooltip
              id="covered-eresources-export-tooltip"
              placement="top"
              text={
                <FormattedMessage id="ui-agreements.eresourcesCovered.exportButton.tooltip" />
              }
            >
              {({ ref, ariaIds }) => (
                <Icon
                  ref={ref}
                  aria-labelledby={ariaIds.text}
                  icon="exclamation-circle"
                  tabIndex="0"
                />
              )}
            </Tooltip>
          ) : (
            ''
          )}
        </Col>
      </Row>
      {agreementEresources ? renderList() : <Spinner />}
    </IfEResourcesEnabled>
  ) : null;
};

CoveredEResourcesList.propTypes = propTypes;
export default CoveredEResourcesList;
