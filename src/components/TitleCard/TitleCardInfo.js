import React from 'react';
import PropTypes from 'prop-types';

import MonographResourceInfo from './MonographResourceInfo';
import SerialResourceInfo from './SerialResourceInfo';
import { resourceTypes, resourceClasses } from '../../constants';

const propTypes = {
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

const TitleCardInfo = ({
  title,
}) => {
  const titleInstance = (title.class === resourceClasses.TITLEINSTANCE) ? title : title?.pti?.titleInstance;

  const { label } = titleInstance?.type;

  const ResourceInfoComponent = (label === resourceTypes.MONOGRAPH || label === resourceTypes.BOOK) ?
    MonographResourceInfo : SerialResourceInfo;

  return (
    <ResourceInfoComponent
      eresourceClass={title.class}
      titleInstance={titleInstance}
    />
  );
};

TitleCardInfo.propTypes = propTypes;
export default TitleCardInfo;
