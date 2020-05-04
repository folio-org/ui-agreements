import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  FormattedUTCDate,
  Headline,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { SerialCoverage } from '../Coverage';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import EResourceType from '../EResourceType';
import { getResourceFromEntitlement, urls } from '../utilities';
import { resourceClasses } from '../../constants';

const AgreementsList = ({ eresource, id, isRelatedEntitlement, resources }) => {
  const isTitle = eresource.type !== undefined;

  const columnMapping = {
    name: <FormattedMessage id="ui-agreements.agreements.name" />,
    type: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
    package: <FormattedMessage id="ui-agreements.eresources.package" />,
    startDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodStart" />,
    endDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodEnd" />,
    parentPackage: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
    acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
  };

  const columnWidths = {
    startDate: 120,
    endDate: 120,
  };

  const formatter = {
    name: res => <div data-test-agreement-name><Link to={urls.agreementView(res?.owner?.id)}>{res?.owner.name}</Link></div>,
    type: res => <div data-test-agreement-status>{res?.owner?.agreementStatus?.label ?? <NoValue />}</div>,
    package: res => <div data-test-agreement-package>{res?.resource?._object?.pkg?.name ?? <NoValue />}</div>,
    startDate: res => <div data-test-agreement-start-date>{res?.owner?.startDate && <FormattedUTCDate value={res?.owner?.startDate} />}</div>,
    endDate: res => <div data-test-agreement-start-date>{res?.owner?.endDate && <FormattedUTCDate value={res?.owner?.endDate} />}</div>,
    parentPackage: res => <EResourceLink eresource={getResourceFromEntitlement(res)} />,
    acqMethod: res => <EResourceType resource={res?.resource} />,
    coverage: res => <SerialCoverage statements={res?.coverage} />,
    isCustomCoverage: res => res.customCoverage && <CustomCoverageIcon />,
  };

  const visibleColumns = [
    'name',
    'type',
    ...(isRelatedEntitlement ? ['package'] : []),
    'startDate',
    'endDate',
    ...(isTitle ? ['parentPackage', 'acqMethod', 'coverage', 'isCustomCoverage'] : []),
  ];

  const renderEmpty = () => {
    if (eresource.class === resourceClasses.PACKAGE) {
      return <FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsPackage" />;
    }

    return isRelatedEntitlement ?
      <FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsOtherPackages" />
      :
      <FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsEresource" />;
  };

  const renderHeadline = () => {
    return eresource.class === resourceClasses.PCI ? (
      <div data-test-eresource-name>
        <Headline margin="small" tag="h4">
          {isRelatedEntitlement ?
            (
              <FormattedMessage
                id="ui-agreements.eresources.otherPlatformPackages"
                values={{ name: eresource?.pti?.titleInstance?.name }}
              />
            ) : eresource.name
          }
        </Headline>
      </div>
    ) : null;
  };

  return (
    <div>
      {renderHeadline()}
      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={resources}
        formatter={formatter}
        id={`${id}-agreements`}
        interactive={false}
        isEmptyMessage={renderEmpty()}
        visibleColumns={visibleColumns}
      />
    </div>
  );
};

AgreementsList.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.object),
  eresource: PropTypes.shape({
    class: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.object,
  }),
  id: PropTypes.string,
  isRelatedEntitlement: PropTypes.bool
};

export default AgreementsList;
