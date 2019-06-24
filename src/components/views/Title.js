import React from 'react';
import PropTypes from 'prop-types';

import {
  AcquisitionOptions,
  Agreements,
  TitleInfo,
} from '../EResourceSections';

export default class Title extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div id="package">
        <TitleInfo data={data} />
        <Agreements data={data} />
        <AcquisitionOptions data={data} />
      </div>
    );
  }
}
