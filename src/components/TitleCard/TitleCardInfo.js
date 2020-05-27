import React from 'react';
import PropTypes from 'prop-types';

import MonographResourceInfo from './MonographResourceInfo';
import SerialResourceInfo from './SerialResourceInfo';
import { resourceTypes } from '../../constants';

const propTypes = {
  title: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.shape({ label: PropTypes.string }),
      PropTypes.string,
    ]),
    pti: PropTypes.shape({
      titleInstance: PropTypes.shape({
        type: PropTypes.shape({
          label: PropTypes.string,
        }),
      }),
    }),
  }),
};

const TitleCardInfo = ({ title }) => {
  const titleInstance = title?.pti?.titleInstance ?? title;
  const type = (titleInstance?.type?.label ?? titleInstance?.type ?? '').toLowerCase();

  if (type === resourceTypes.MONOGRAPH || type === resourceTypes.BOOK) {
    return <MonographResourceInfo titleInstance={titleInstance} />;
  }

  return <SerialResourceInfo titleInstance={titleInstance} />;
};

TitleCardInfo.propTypes = propTypes;
export default TitleCardInfo;
