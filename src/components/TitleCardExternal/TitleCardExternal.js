/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Card,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';
import EResourceLink from '../EResourceLink';

const propTypes = {
  headerEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  searchString: PropTypes.string,
  title: PropTypes.shape({}),
};

const TitleCardExternal = ({
  headerEnd,
  searchString = '',
  title,
}) => {
  const titleInfo = title?.reference_object ?? title;

  const renderHeaderStart = () => {
    // if (title?.type === 'GOKB_TITLE') {
    //   return (
    //     <AppIcon app="agreements" iconKey="title" size="small">
    //       <strong data-test-title-instance-name>
    //         {titleInfo?.name ?? <NoValue />}
    //       </strong>
    //     </AppIcon>
    //   );
    // }
    return (
      <AppIcon app="eholdings" size="small">
        <strong data-test-title-instance-name>
          <EResourceLink eresource={title} searchString={searchString} />
        </strong>
      </AppIcon>
    );
  };

  const renderCardContent = () => {
    if (title?.type === 'GOKB_TITLE') {
      return (
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.gokbPackageUuid" />}>
              <div data-test-title-pkg-uuid>
                {titleInfo?.tipp?.tippPackageUuid ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.gokbTitleUuid" />}>
              <div data-test-title-uuid>
                {titleInfo?.tipp?.tippTitleUuid ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
        </Row>
      );
    }
    return (
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.publicationType" />}>
            <div data-test-title-type>
              {titleInfo?.publicationType ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.holdingStatus" />}>
            <div data-test-title-holding-status>
              {titleInfo?.isSelected ? <FormattedMessage id="ui-agreements.eresources.selected" />
                : <FormattedMessage id="ui-agreements.eresources.notSelected" />
              }
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.accessStatusType" />}>
            <div data-test-title-access-status-type>
              {titleInfo?.accessStatusType ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
    );
  };

  return (
    <Card
      cardStyle="positive"
      data-test-title-card
      data-testid="titleCardExternal"
      headerEnd={headerEnd}
      headerStart={renderHeaderStart()}
      roundedBorder
    >
      {renderCardContent()}
    </Card>
  );
};

TitleCardExternal.propTypes = propTypes;
export default TitleCardExternal;
