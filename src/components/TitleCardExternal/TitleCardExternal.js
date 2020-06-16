/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  FormattedUTCDate,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import EResourceLink from '../EResourceLink';

const propTypes = {
  searchString: PropTypes.string,
  title: PropTypes.object,
};

const TitleCardExternal = ({
  searchString = '',
  title,
}) => {
  return (
    <Card
      cardStyle="positive"
      data-test-title-card
      headerStart={(
        <strong data-test-title-instance-name>
          <EResourceLink eresource={title} searchString={searchString} />
        </strong>
      )}
      roundedBorder
    >
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.type" />}>
            <div data-test-title--type>
              {title?.reference_object?.type ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.holdingStatus" />}>
            <div data-test-holding-status>
              {title?.reference_object?.isSelected ? <FormattedMessage id="ui-agreements.eresources.selected" />
                : <FormattedMessage id="ui-agreements.eresources.notSelected" />
    }
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.accessStatusType" />}>
            <div data-test-access-status-type>
              {title?.reference_object?.accessStatusType ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        { title?.dateMonographPublished ?
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.datePublished" />}>
              <div data-test-vendor-name>
                <FormattedUTCDate value={title.dateMonographPublished} />
              </div>
            </KeyValue>
          </Col>
          :
          null
        }
      </Row>
    </Card>
  );
};

TitleCardExternal.propTypes = propTypes;
export default TitleCardExternal;
