import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import PackageCard from '../PackageCard';
import TitleCard from '../TitleCard';

import { resourceClasses } from '../../constants';

const propTypes = {
  line: PropTypes.shape({
    endDate: PropTypes.string,
    id: PropTypes.string,
    note: PropTypes.string,
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    resource: PropTypes.shape({
      _object: PropTypes.object,
    }),
    startDate: PropTypes.string,
  }).isRequired,
};

const Info = ({
  line,
}) => {
  const resource = line.resource?._object ?? {};
  const resourceClass = line.resource?.class;

  return (
    <>
      <Headline size="x-large" tag="h2">
        <FormattedMessage id="ui-agreements.line.lineInformation" />
      </Headline>
      <KeyValue label={<FormattedMessage id="ui-agreements.line.parentAgreement" />}>
        <div data-test-agreement-line-agreement>
          {line.owner?.name ?? <NoValue />}
        </div>
      </KeyValue>
      <Row>
        <Col md={3} xs={6}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.activeFrom" />}>
            <div data-test-agreement-line-active-from>
              {line.startDate ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col md={3} xs={6}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.activeTo" />}>
            <div data-test-agreement-line-active-to>
              {line.endDate ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col md={6} xs={12}>
          <KeyValue label={<FormattedMessage id="ui-agreements.note" />}>
            <div data-test-agreement-line-note>
              {line.note ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
      { resourceClass === resourceClasses.PACKAGE ?
        <>
          <Headline size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.packageDetails" />
          </Headline>
          <PackageCard pkg={resource} />
        </>
        :
        <>
          <Headline size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.titleDetails" />
          </Headline>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.titleOnPlatformURL" />}>
            {resource.pti?.url ?
              <a href={resource.pti?.url} rel="noopener noreferrer" target="_blank">{resource.pti?.url}</a>
              :
              <NoValue />
            }
          </KeyValue>
          <TitleCard title={resource} />
          <Headline size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
          </Headline>
          <PackageCard pkg={resource.pkg} />
        </>
      }
    </>
  );
};

Info.propTypes = propTypes;
export default Info;
