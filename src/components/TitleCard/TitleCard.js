import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@folio/stripes/components';

import TitleCardInfo from './TitleCardInfo';
import EResourceLink from '../EResourceLink';

const propTypes = {
  searchString: PropTypes.string,
  title: PropTypes.object,
};

const TitleCard = ({
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
      <TitleCardInfo title={title} />
    </Card>
  );
};

TitleCard.propTypes = propTypes;
export default TitleCard;
