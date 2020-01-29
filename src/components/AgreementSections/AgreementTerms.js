import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropertiesList } from '@folio/stripes-erm-components';

export default class AgreementTerms extends React.Component {
  static propTypes = {
    record: PropTypes.shape({ customProperties: PropTypes.object }),
    terms: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { record, terms } = this.props;

    return (
      <CustomPropertiesList
        resource={record}
        customProperties={terms}
      />
    );
  }
}
