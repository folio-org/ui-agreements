import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { AppIcon } from '@folio/stripes/core';
import {
  Col,
  FormattedUTCDate,
  Headline,
  KeyValue,
  MetaSection,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { ErrorCard, isPackage } from '@folio/stripes-erm-components';
import PackageCard from '../../PackageCard';
import PackageCardExternal from '../../PackageCardExternal';
import TitleCard from '../../TitleCard';
import TitleCardExternal from '../../TitleCardExternal';
import { useLocalGokbPkg } from '../../../hooks';
import { isDetached, isExternal, urls } from '../../utilities';
import { GOKB_RESOURCE_AUTHORITY } from '../../../constants';

const propTypes = {
  isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
  line: PropTypes.shape({
    activeFrom: PropTypes.string,
    activeTo: PropTypes.string,
    authority: PropTypes.string,
    dateCreated: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.string,
    lastUpdated: PropTypes.string,
    note: PropTypes.string,
    owner: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    reference_object: PropTypes.object,
    resource: PropTypes.shape({
      _object: PropTypes.object,
    }),
    suppressFromDiscovery: PropTypes.bool,
  }).isRequired,
  resource: PropTypes.object.isRequired,
};

const getTitlePlatformUrl = ({ resource, external }) => {
  if (external) {
    const url = resource.reference_object?.url;
    return url ? (
      <a href={url} rel="noopener noreferrer" target="_blank">{url}</a>
    ) : <NoValue />;
  }
  const url = resource.pti?.url;
  return url ? (
    <a href={url} rel="noopener noreferrer" target="_blank">{url}</a>
  ) : <NoValue />;
};

const renderTemplatedUrls = (resource) => {
  const templated = resource?.pti?.templatedUrls ?? [];
  if (templated.length <= 1) return null;

  const sorted = orderBy(
    templated.filter(tu => tu?.name !== 'defaultUrl'),
    'name',
    'asc'
  );

  return (
    <KeyValue label={<FormattedMessage id="ui-agreements.eresources.proxiedAndCustomizedUrls" />}>
      <MultiColumnList
        columnMapping={{
          name: <FormattedMessage id="ui-agreements.eresources.proxiesCustomizers" />,
          url: <FormattedMessage id="ui-agreements.eresources.url" />,
        }}
        contentData={sorted}
        id="templated-urls"
        interactive={false}
        visibleColumns={['name', 'url']}
      />
    </KeyValue>
  );
};

const renderErrorCard = (resource) => {
  let headerText;
  if (resource.reference && resource.authority) {
    headerText = `${resource.authority}: ${resource.reference}`;
  } else if (resource.authority) {
    headerText = resource.authority;
  } else {
    headerText = resource.reference;
  }

  return (
    <ErrorCard
      cardStyle="positive"
      error={{ number: resource.reference_object?.error, message: resource.reference_object?.message }}
      headerStart={(
        <AppIcon app="e-holdings" size="small">
          <strong>
            {headerText}
          </strong>
        </AppIcon>
      )}
    />
  );
};

const renderPackageSection = ({ resource, external }) => (
  <>
    <Headline size="large" tag="h3">
      <FormattedMessage id="ui-agreements.eresources.packageDetails" />
    </Headline>
    {external ? <PackageCardExternal pkg={resource} /> : <PackageCard pkg={resource} />}
  </>
);

const renderTitleSection = ({ resource, external, isGokb }) => (
  <>
    <Headline size="large" tag="h3">
      <FormattedMessage id="ui-agreements.eresources.titleDetails" />
    </Headline>

    <KeyValue label={<FormattedMessage id="ui-agreements.eresources.titleOnPlatformURL" />}>
      <div data-test-agreement-line-url>
        {getTitlePlatformUrl({ resource, external })}
      </div>
    </KeyValue>

    {renderTemplatedUrls(resource)}

    {external ? <TitleCardExternal title={resource} /> : <TitleCard title={resource} />}

    <Headline size="large" tag="h3">
      <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
    </Headline>
    {(external && !isGokb)
      ? <PackageCardExternal packageData={resource.reference_object?.packageData ?? {}} />
      : <PackageCard pkg={resource.pkg ?? {}} />}
  </>
);

const Info = ({ isSuppressFromDiscoveryEnabled, line, resource: incomingResource }) => {
  const isGokb = line?.authority === GOKB_RESOURCE_AUTHORITY;
  const lookupReference = isGokb ? incomingResource?.reference : undefined;
  const localPkg = useLocalGokbPkg({ reference: lookupReference });
  const resource = isGokb ? { ...incomingResource, pkg: localPkg } : incomingResource;

  const external = isExternal(line);
  const hasRefErr = !!resource.reference_object?.error;
  const isPkg = isPackage(resource);

  let detailsSection = null;
  if (!isDetached(line)) {
    if (hasRefErr) {
      detailsSection = renderErrorCard(resource);
    } else if (isPkg) {
      detailsSection = renderPackageSection({ resource, external });
    } else {
      detailsSection = renderTitleSection({ resource, external, isGokb });
    }
  }

  return (
    <div data-testid="lineInfo">
      <Headline size="x-large" tag="h2">
        <FormattedMessage id="ui-agreements.line.lineInformation" />
      </Headline>

      <MetaSection
        contentId="agreementLineInfoRecordMetaContent"
        createdDate={line.dateCreated}
        hideSource
        id="agreementLineInfoRecordMeta"
        lastUpdatedDate={line.lastUpdated}
      />

      <KeyValue label={<FormattedMessage id="ui-agreements.line.parentAgreement" />}>
        <div data-test-agreement-line-agreement>
          {line.owner?.id ? (
            <Link to={urls.agreementView(line.owner.id)}>
              {line.owner.name}
            </Link>
          ) : <NoValue />}
        </div>
      </KeyValue>

      <Row>
        <Col md={3} xs={6}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.activeFrom" />}>
            <div data-test-agreement-line-active-from>
              {line?.activeFrom ? <FormattedUTCDate value={line?.activeFrom} /> : <NoValue />}
            </div>
          </KeyValue>
        </Col>

        <Col md={3} xs={6}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.activeTo" />}>
            <div data-test-agreement-line-active-to>
              {line?.activeTo ? <FormattedUTCDate value={line?.activeTo} /> : <NoValue />}
            </div>
          </KeyValue>
        </Col>

        {isSuppressFromDiscoveryEnabled('agreementLine') && (
          <Col md={3} xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreementLines.suppressFromDiscovery" />}>
              <div data-test-agreement-line-suppress-from-discovery>
                <FormattedMessage id={`ui-agreements.${line.suppressFromDiscovery ? 'yes' : 'no'}`} />
              </div>
            </KeyValue>
          </Col>
        )}

        <Col md={3} xs={12}>
          <KeyValue label={<FormattedMessage id="ui-agreements.note" />}>
            <div data-test-agreement-line-note>
              {line.note ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>

      <Row>
        <Col md={3} xs={12}>
          <KeyValue label={<FormattedMessage id="ui-agreements.description" />}>
            <div data-test-agreement-line-description>
              {line.description ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
      {detailsSection}
    </div>
  );
};

Info.propTypes = propTypes;
export default Info;
