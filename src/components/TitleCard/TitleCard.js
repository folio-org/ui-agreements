import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, NoValue } from '@folio/stripes/components';

import TitleCardInfo from './TitleCardInfo';
import { urls } from '../utilities';
import { resourceClasses } from '../../constants';

const propTypes = {
  searchString: PropTypes.string,
  title: PropTypes.shape({
    class: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.shape({
      label: PropTypes.string,
    }),
    publisher: PropTypes.shape({
      label: PropTypes.string,
    }),
  }),
};

const TitleCard = ({
  searchString = '',
  title,
}) => {
  const titleInstance = (title.class === resourceClasses.TITLEINSTANCE) ? title : title?.pti?.titleInstance;

  return (
    <Card
      cardStyle="positive"
      headerStart={(
        <Link to={`${urls.eresourceView(titleInstance.id)}${searchString}`}>
          <strong data-test-title-instance-name>{titleInstance.name ?? <NoValue />}</strong>
        </Link>
      )}
      roundedBorder
    >
      <TitleCardInfo title={title} />
    </Card>
  );
};

TitleCard.propTypes = propTypes;
export default TitleCard;
