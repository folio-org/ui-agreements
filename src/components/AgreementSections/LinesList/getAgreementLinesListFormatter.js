import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  FormattedUTCDate,
  NoValue,
  Spinner,
  Tooltip
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { EResourceType } from '@folio/stripes-erm-components';

import Coverage from '../../Coverage';
import CustomCoverageIcon from '../../CustomCoverageIcon';
import EResourceLink from '../../EResourceLink';
import EResourceCount from '../../EResourceCount';
import EResourceProvider from '../../EResourceProvider';

import getResourceFromEntitlement from '../../utilities/getResourceFromEntitlement';
import isDetached from '../../utilities/isDetached';
import isExternal from '../../utilities/isExternal';
import urls from '../../utilities/urls';

const renderDate = (date) => (date ? <FormattedUTCDate value={date} /> : '');

const hasReferenceError = (line) => !!line?.reference_object?.error;

const renderErroredExternalReference = (resource) => {
  const output = [resource.authority, resource.reference].filter(Boolean).join(': ');

  return resource.resourceName ? `${output} (${resource.resourceName})` : output;
};

const renderPOLines = (agreementLine, orderLines, areOrderLinesLoading) => {
  if (!agreementLine?.poLines?.length) return <></>;
  if (!orderLines?.length || areOrderLinesLoading) return <Spinner />;

  const poLines = agreementLine.poLines.map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId));
  if (!poLines.length) return <Spinner />;

  return (
    <div>
      {poLines.map((poLine, i) => (
        poLine?.id
          ? (
            <Tooltip
              key={poLine.id}
              id={`tooltip-${agreementLine.id}-${poLine.id}`}
              placement="left"
              text={poLine.titleOrPackage}
            >
              {({ ref, ariaIds }) => (
                <div
                  ref={ref}
                  aria-labelledby={ariaIds.text}
                >
                  <Link
                    data-test-po-line
                    to={urls.poLineView(poLine.id)}
                  >
                    {poLine.poLineNumber}
                  </Link>
                </div>
              )}
            </Tooltip>
          )
          : <Spinner key={`spinner-${agreementLine.id}-${i}`} />
      ))}
    </div>
  );
};

const wrapError = (renderFunc) => (agreementLine) => {
  if (hasReferenceError(agreementLine)) return <></>;

  return renderFunc(agreementLine);
};

const getAgreementLinesListFormatter = ({ areOrderLinesLoading, orderLines }) => {
  return {
    name: (agreementLine) => {
      const resource = getResourceFromEntitlement(agreementLine);
      if (!resource) return agreementLine.label;
      if (isDetached(resource)) return resource.description;
      if (isExternal(resource) && hasReferenceError(resource)) return renderErroredExternalReference(resource);
      if (isExternal(resource) && !resource.reference_object?.label && !resource?.resourceName) return resource.reference;
      return (
        <EResourceLink
          data-test-external-reference={agreementLine.reference}
          data-test-resource-id={agreementLine?.resource?.id}
          eresource={resource}
        />
      );
    },
    provider: wrapError((agreementLine) => <EResourceProvider resource={agreementLine.resource || agreementLine} />),
    publicationType: wrapError((agreementLine) => {
      const resource = getResourceFromEntitlement(agreementLine);
      return isDetached(resource) ? <NoValue /> : <EResourceType resource={resource} />;
    }),
    activeFrom: wrapError((agreementLine) => <div data-test-active-from>{renderDate(agreementLine.startDate)}</div>),
    activeTo: wrapError((agreementLine) => <div data-test-active-to>{renderDate(agreementLine.endDate)}</div>),
    count: wrapError((agreementLine) => <EResourceCount resource={getResourceFromEntitlement(agreementLine)} />),
    note: wrapError((agreementLine) => <div style={{ overflowWrap: 'break-word', maxWidth: 250, whiteSpace: 'pre-wrap' }}>{agreementLine.note}</div>),
    coverage: wrapError((agreementLine) => <Coverage line={agreementLine} />),
    isCustomCoverage: wrapError((agreementLine) => {
      if (!agreementLine.customCoverage) return <></>;

      return (
        <Tooltip
          id={`agreement-line-cc-tooltip-${agreementLine.rowIndex}`}
          text={<FormattedMessage id="ui-agreements.customcoverages.tooltip" />}
        >
          {({ ref, ariaIds }) => <CustomCoverageIcon ref={ref} aria-labelledby={ariaIds.text} />
          }
        </Tooltip>
      );
    }),
    poLines: wrapError((agreementLine) => (
      <IfPermission perm="orders.po-lines.collection.get">
        {({ hasPermission }) => {
          if (hasPermission) return renderPOLines(agreementLine, orderLines, areOrderLinesLoading);

          return agreementLine?.poLines?.length
            ? <FormattedMessage id="ui-agreements.agreementLines.noPoLinePerm" />
            : null;
        }}
      </IfPermission>
    ))
  };
};

export default getAgreementLinesListFormatter;
