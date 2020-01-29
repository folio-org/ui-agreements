import React from 'react';
import PropTypes from 'prop-types';

import { FormTerms } from '@folio/stripes-erm-components';

class FormCustomProperties extends React.Component {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    return (
      <FormTerms data={this.props.data} />
    );
  }
}

export default FormCustomProperties;
