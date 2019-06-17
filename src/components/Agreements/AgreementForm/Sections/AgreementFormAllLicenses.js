import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import LicensesFieldArray from '../components/LicensesFieldArray';

export default class AgreementFormAllLicenses extends React.Component {
  static propTypes = {
    parentResources: PropTypes.object,
  }

  render() {
    return (
      <div data-test-licenses-form-all-licenses>
        <FieldArray
          component={LicensesFieldArray}
          name="linkedLicenses"
          parentResources={this.props.parentResources}
        />
      </div>
    );
  }
}
