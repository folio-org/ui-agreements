import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import {
  Col,
  Icon,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import { renderResourceType } from '../../../../util/resourceType';

class EResourceAgreements extends React.Component {
  static manifest = Object.freeze({
    entitlements: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlements',
      throwErrors: false, // We can get a 404 from this endpoint
    },
  })

  static propTypes = {
    match: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    resources: PropTypes.shape({
      entitlements: PropTypes.object,
    }),
    stripes: PropTypes.object,
  };


  render() {
    const { resources: { entitlements }, stripes: { intl } } = this.props;

    if (!entitlements || !entitlements.records) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <Row>
        <Col xs={12}>
          <MultiColumnList
            contentData={entitlements.records}
            maxHeight={400}
            visibleColumns={['name', 'type', 'startDate', 'endDate', 'package', 'acqMethod']}
            formatter={{
              name: ({ owner }) => <Link to={`/erm/agreements/view/${owner.id}`}>{owner.name}</Link>,
              type: ({ owner }) => owner.agreementStatus && owner.agreementStatus.label,
              startDate: ({ owner }) => owner.startDate && intl.formatDate(owner.startDate),
              endDate: ({ owner }) => owner.endDate && intl.formatDate(owner.endDate),
              package: ({ resource }) => <Link to={`/erm/eresources/view/${resource.id}`}>{resource.name}</Link>,
              acqMethod: ({ resource }) => renderResourceType(resource),
            }}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-erm.eresources.erAgreements' }),
              type: intl.formatMessage({ id: 'ui-erm.eresources.agreementStatus' }),
              startDate: intl.formatMessage({ id: 'ui-erm.agreements.startDate' }),
              endDate: intl.formatMessage({ id: 'ui-erm.agreements.endDate' }),
              package: intl.formatMessage({ id: 'ui-erm.eresources.parentPackage' }),
              acqMethod: intl.formatMessage({ id: 'ui-erm.eresources.acqMethod' }),
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default EResourceAgreements;
