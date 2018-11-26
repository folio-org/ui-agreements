
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedDate, FormattedMessage } from 'react-intl';
import {
  Col,
  Icon,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import { renderResourceType } from '../../../util/resourceType';

class EResourceAgreements extends React.Component {
  static manifest = Object.freeze({
    entitlements: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlements',
      throwErrors: false, // We can get a 404 from this endpoint
      perRequest: 100,
      limitParam: 'perPage',
    },
  })

  static propTypes = {
    match: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    resources: PropTypes.shape({
      entitlements: PropTypes.object,
    }),
    type: PropTypes.oneOf(['title', 'package']),
  };

  visibleColumns = () => ([
    'name',
    'type',
    'startDate',
    'endDate',
    ...(this.props.type === 'title' ?
      ['package', 'acqMethod'] : []
    ),
  ]);

  formatter = () => ({
    name: ({ owner }) => <Link to={`/erm/agreements/view/${owner.id}`}>{owner.name}</Link>,
    type: ({ owner }) => owner.agreementStatus && owner.agreementStatus.label,
    startDate: ({ owner }) => owner.startDate && <FormattedDate value={owner.startDate} />,
    endDate: ({ owner }) => owner.endDate && <FormattedDate value={owner.endDate} />,
    ...(this.props.type === 'title' ?
      {
        package: ({ resource }) => <Link to={`/erm/eresources/view/${resource.id}`}>{resource.name}</Link>,
        acqMethod: ({ resource }) => renderResourceType(resource),
      }
      :
      {}
    ),
  });

  columnMapping = () => ({
    name: <FormattedMessage id="ui-agreements.agreements.name" />,
    type: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
    startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
    endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
    ...(this.props.type === 'title' ?
      {
        package: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
        acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
      }
      :
      {}
    ),
  });

  columnWidths = () => ({
    startDate: 120,
    endDate: 120,
  });

  render() {
    const { resources: { entitlements } } = this.props;

    if (!entitlements || !entitlements.records) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <Row>
        <Col xs={12}>
          <MultiColumnList
            contentData={entitlements.records}
            interactive={false}
            maxHeight={400}
            columnMapping={this.columnMapping()}
            columnWidths={this.columnWidths()}
            formatter={this.formatter()}
            visibleColumns={this.visibleColumns()}
          />
        </Col>
      </Row>
    );
  }
}

export default EResourceAgreements;
