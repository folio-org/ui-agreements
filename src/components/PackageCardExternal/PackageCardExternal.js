import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import EResourceLink from '../EResourceLink';

const propTypes = {
  packageData: PropTypes.shape({
    accessStatusType: PropTypes.string,
    contentType: PropTypes.string,
    isSelected: PropTypes.bool,
    name: PropTypes.string,
    providerName: PropTypes.string,
    selectedCount: PropTypes.number,
    titleCount: PropTypes.number,
  }),
  pkg: PropTypes.shape({
    reference_object: PropTypes.shape({
      accessStatusType: PropTypes.string,
      contentType: PropTypes.string,
      isSelected: PropTypes.bool,
      providerName: PropTypes.string,
      selectedCount: PropTypes.number,
      titleCount: PropTypes.number,
    }),
  }),
  searchString: PropTypes.string,
};

const PackageCardExternal = ({
  pkg = {},
  searchString = '',
  packageData = {},
}) => {
  let cardHeader;
  let pkgObject;
  if (pkg.reference_object) {
    pkgObject = pkg.reference_object;
    cardHeader = <EResourceLink eresource={pkg} searchString={searchString} />;
  } else if (packageData) {
    pkgObject = packageData;
    cardHeader = packageData?.name;
  }
  return (
    <Card
      cardStyle="positive"
      data-test-package-card
      headerStart={(
        <strong data-test-package-link>
          {cardHeader}
        </strong>
    )}
      roundedBorder
    >
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.contentType" />}>
            {pkgObject?.contentType ?? <NoValue />}
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.holdingStatus" />}>
            <div data-test-holding-status>
              {pkgObject?.isSelected ? <FormattedMessage id="ui-agreements.eresources.selected" />
                : <FormattedMessage id="ui-agreements.eresources.notSelected" />
    }
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.accessStatusType" />}>
            <div data-test-access-status-type>
              {pkgObject?.accessStatusType ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.provider" />}>
            <div data-test-vendor-name>
              {pkgObject?.providerName ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.count" />}>
            <div data-test-resource-count>
              {pkgObject?.selectedCount ?? <NoValue />} / {pkgObject?.titleCount ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
    </Card>);
};

PackageCardExternal.propTypes = propTypes;
export default PackageCardExternal;
