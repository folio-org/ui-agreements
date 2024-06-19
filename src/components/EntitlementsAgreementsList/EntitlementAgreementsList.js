import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  FormattedUTCDate,
  Headline,
  Layout,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import { EResourceType, usePrevNextPagination } from '@folio/stripes-erm-components';
import Coverage from '../Coverage';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import { getResourceFromEntitlement, urls, parseMclPageSize } from '../utilities';
import { statuses, ENTITLEMENT_AGREEMENTS_LIST_PAGINATION_ID } from '../../constants';
import { useAgreementsSettings } from '../../hooks';

const EntitlementAgreementsList = (
  { entitlements,
    eresourceId,
    headline,
    id,
    isEmptyMessage = <FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsEresource" />,
    totalCount,
    visibleColumns = ['name', 'type', 'startDate', 'endDate'] }
) => {
  const settings = useAgreementsSettings();
  const entitlementAgreementsPageSize = parseMclPageSize(settings, 'entitlements');
  const {
    paginationMCLProps,
  } = usePrevNextPagination({
    count: totalCount,
    pageSize: entitlementAgreementsPageSize,
    id: `${ENTITLEMENT_AGREEMENTS_LIST_PAGINATION_ID}-${eresourceId}`,
    syncToLocation: false
  });

  const columnMapping = {
    name: <FormattedMessage id="ui-agreements.agreements.name" />,
    type: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
    package: <FormattedMessage id="ui-agreements.eresources.package" />,
    startDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodStart" />,
    endDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodEnd" />,
    eresource: <FormattedMessage id="ui-agreements.eresource" />,
    acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
  };

  const columnWidths = {
    name: { min: 200, max: 400 },
    eresource: { min: 200, max: 400 },
    acqMethod: 100,
    startDate: 120,
    endDate: 120,
  };

  const formatter = {
    name: e => {
      const iconKey = e?.owner?.agreementStatus?.value === statuses.CLOSED ? 'closedAgreement' : 'app';
      return (
        <AppIcon
          app="agreements"
          iconAlignment="baseline"
          iconKey={iconKey}
          size="small"
        >
          <div data-test-agreement-name><Link to={urls.agreementView(e?.owner?.id)}>{e?.owner?.name}</Link></div>
        </AppIcon>
      );
    },
    type: e => <div data-test-agreement-status>{e?.owner?.agreementStatus?.label ?? <NoValue />}</div>,
    package: e => <div data-test-agreement-package>{e?.resource?._object?.pkg?.name ?? <NoValue />}</div>,
    startDate: e => <div data-test-agreement-start-date>{e?.owner?.startDate && <FormattedUTCDate value={e?.owner?.startDate} />}</div>,
    endDate: e => <div data-test-agreement-start-date>{e?.owner?.endDate && <FormattedUTCDate value={e?.owner?.endDate} />}</div>,
    eresource: e => <EResourceLink eresource={getResourceFromEntitlement(e)} />,
    acqMethod: e => <EResourceType resource={e?.resource} />,
    coverage: e => <Coverage line={e} />,
    isCustomCoverage: e => e.customCoverage && <CustomCoverageIcon />,
  };

  const renderHeadline = () => {
    return headline ? (
      <Layout className="padding-top-gutter" data-test-eresource-name>
        <Headline margin="small" tag="h4">
          {headline}
        </Headline>
      </Layout>
    ) : null;
  };

  return (
    <div>
      {renderHeadline()}
      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={entitlements}
        formatter={formatter}
        id={id}
        interactive={false}
        isEmptyMessage={isEmptyMessage}
        pagingType="click"
        totalCount={totalCount}
        visibleColumns={visibleColumns}
        {...paginationMCLProps}
      />
    </div>
  );
};

EntitlementAgreementsList.propTypes = {
  entitlements: PropTypes.arrayOf(PropTypes.object),
  eresourceId: PropTypes.string.isRequired,
  headline: PropTypes.node,
  id: PropTypes.string,
  isEmptyMessage: PropTypes.node,
  totalCount: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default EntitlementAgreementsList;
