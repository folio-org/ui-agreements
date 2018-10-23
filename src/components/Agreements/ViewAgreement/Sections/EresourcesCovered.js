import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

class EresourcesCovered extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    intl: intlShape,
  };

  render() {
    const { agreementLines, intl } = this.props;

    return (
      <div>TBD</div>
    );
  }
}

export default injectIntl(EresourcesCovered);
