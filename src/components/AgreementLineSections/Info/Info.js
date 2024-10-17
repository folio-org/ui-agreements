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
import { isDetached, isExternal, urls } from '../../utilities';

const propTypes = {
  isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
  line: PropTypes.shape({
    activeFrom: PropTypes.string,
    activeTo: PropTypes.string,
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

const Info = ({ isSuppressFromDiscoveryEnabled, line, resource }) => {
  const sortedTemplatedUrls = orderBy(
    resource?.pti?.templatedUrls,
    'name',
    'asc'
  ).filter((tu) => tu?.name !== 'defaultUrl');

  return (
    <>
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
        <KeyValue
          label={<FormattedMessage id="ui-agreements.line.parentAgreement" />}
        >
          <div data-test-agreement-line-agreement>
            {line.owner?.id ? (
              <Link to={urls.agreementView(line.owner.id)}>
                {line.owner.name}
              </Link>
            ) : (
              <NoValue />
            )}
          </div>
        </KeyValue>
        <Row>
          <Col md={3} xs={6}>
            <KeyValue
              label={
                <FormattedMessage id="ui-agreements.eresources.activeFrom" />
              }
            >
              <div data-test-agreement-line-active-from>
                {line?.activeFrom ? (
                  <FormattedUTCDate value={line?.activeFrom} />
                ) : (
                  <NoValue />
                )}
              </div>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue
              label={
                <FormattedMessage id="ui-agreements.eresources.activeTo" />
              }
            >
              <div data-test-agreement-line-active-to>
                {line?.activeTo ? (
                  <FormattedUTCDate value={line?.activeTo} />
                ) : (
                  <NoValue />
                )}
              </div>
            </KeyValue>
          </Col>
          {isSuppressFromDiscoveryEnabled('agreementLine') ? (
            <Col md={3} xs={12}>
              <KeyValue
                label={
                  <FormattedMessage id="ui-agreements.agreementLines.suppressFromDiscovery" />
                }
              >
                <div data-test-agreement-line-suppress-from-discovery>
                  <FormattedMessage
                    id={`ui-agreements.${line.suppressFromDiscovery ? 'yes' : 'no'}`}
                  />
                </div>
              </KeyValue>
            </Col>
          ) : null}
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
            <KeyValue
              label={<FormattedMessage id="ui-agreements.description" />}
            >
              <div data-test-agreement-line-description>
                {line.description ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
        {!isDetached(line) ? (
          !resource.reference_object?.error ? (
            isPackage(resource) ? (
              <>
                <Headline size="large" tag="h3">
                  <FormattedMessage id="ui-agreements.eresources.packageDetails" />
                </Headline>
                {isExternal(line) ? (
                  <PackageCardExternal pkg={resource} />
                ) : (
                  <PackageCard pkg={resource} />
                )}
              </>
            ) : (
              <>
                <Headline size="large" tag="h3">
                  <FormattedMessage id="ui-agreements.eresources.titleDetails" />
                </Headline>
                <KeyValue
                  label={
                    <FormattedMessage id="ui-agreements.eresources.titleOnPlatformURL" />
                  }
                >
                  <div data-test-agreement-line-url>
                    {isExternal(line) ? (
                      resource.reference_object?.url ? (
                        <a
                          href={resource.reference_object.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {resource.reference_object?.url}
                        </a>
                      ) : (
                        <NoValue />
                      )
                    ) : resource.pti?.url ? (
                      <a
                        href={resource.pti.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {resource.pti?.url}
                      </a>
                    ) : (
                      <NoValue />
                    )}
                  </div>
                </KeyValue>
                {resource?.pti?.templatedUrls.length > 1 && (
                  <KeyValue
                    label={
                      <FormattedMessage id="ui-agreements.eresources.proxiedAndCustomizedUrls" />
                    }
                  >
                    <MultiColumnList
                      columnMapping={{
                        name: (
                          <FormattedMessage id="ui-agreements.eresources.proxiesCustomizers" />
                        ),
                        url: (
                          <FormattedMessage id="ui-agreements.eresources.url" />
                        ),
                      }}
                      contentData={sortedTemplatedUrls}
                      id="templated-urls"
                      interactive={false}
                      visibleColumns={['name', 'url']}
                    />
                  </KeyValue>
                )}
                {isExternal(line) ? (
                  <TitleCardExternal title={resource} />
                ) : (
                  <TitleCard title={resource} />
                )}
                <Headline size="large" tag="h3">
                  <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
                </Headline>
                {isExternal(line) ? (
                  <PackageCardExternal
                    packageData={resource.reference_object?.packageData ?? {}}
                  />
                ) : (
                  <PackageCard pkg={resource.pkg ?? {}} />
                )}
              </>
            )
          ) : (
            <ErrorCard
              cardStyle="positive"
              error={{ number: resource.reference_object?.error, message: resource.reference_object?.message }}
              headerStart={(
                <AppIcon app="e-holdings" size="small">
                  <strong>
                    {(resource.reference && resource.authority) ? `${resource.authority}: ${resource.reference}` : (resource.authority ? resource.authority : resource.reference)}
                  </strong>
                </AppIcon>
              )}
            />
          )
        ) : null}
      </div>
    </>
  );
};

Info.propTypes = propTypes;
export default Info;
