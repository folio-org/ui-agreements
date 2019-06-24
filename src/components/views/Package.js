import React from 'react';
import PropTypes from 'prop-types';

import {
  Agreements,
  PackageContents,
  PackageInfo,
} from '../EResourceSections';

export default class Package extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div id="package">
        <PackageInfo data={data} />
        <Agreements data={data} />
        <PackageContents data={data} />
      </div>
    );
  }
}
