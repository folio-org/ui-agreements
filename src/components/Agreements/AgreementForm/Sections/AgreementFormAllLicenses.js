import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import LicensesFieldArray from '../components/LicensesFieldArray';

export default class AgreementFormAllLicenses extends React.Component {
  static propTypes = {
    parentResources: PropTypes.object,
  }

  render() {
    return (
      <Accordion
        id="licenses-form-all-licenses"
        label={<FormattedMessage id="ui-agreements.license.allLicenses" />}
      >
        <FieldArray
          component={LicensesFieldArray}
          name="linkedLicenses"
          parentResources={this.props.parentResources}
        />
      </Accordion>
    );
  }
}
