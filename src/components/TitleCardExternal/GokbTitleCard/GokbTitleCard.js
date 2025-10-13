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
import EResourceLink from '../../EResourceLink';

const propTypes = {
  headerEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  searchString: PropTypes.string,
  title: PropTypes.shape({}),
};

const GokbTitleCard = ({
  headerEnd,
  searchString = '',
  title,
}) => {
  const titleInfo = {
    packageUuid: title?.tipp?.tippPackageUuid ?? title?.reference?.split(':')[0],
    titleUuid: title?.tipp?.tippTitleUuid ?? title?.reference?.split(':')[1],
  };


  const renderHeaderStart = () => {
    return (
      <AppIcon app="agreements" iconKey="gokb" size="small"> {/* TODO: add icon for GOKB titles */}
        <strong data-test-title-instance-name>
          <EResourceLink eresource={{ ...title, id: titleInfo.titleUuid }} searchString={searchString} />
        </strong>
      </AppIcon>
    );
  };

  const renderCardContent = () => {
    return (
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.gokbPackageUuid" />}>
            <div data-test-title-pkg-uuid>
              {titleInfo?.packageUuid ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.gokbTitleUuid" />}>
            <div data-test-title-uuid>
              {titleInfo?.titleUuid ?? <NoValue />}
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
      data-testid="GokbTitleCard"
      headerEnd={headerEnd}
      headerStart={renderHeaderStart()}
      roundedBorder
    >
      {renderCardContent()}
    </Card>
  );
};

GokbTitleCard.propTypes = propTypes;
export default GokbTitleCard;
