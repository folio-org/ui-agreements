import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import LicensesFieldArray from '../components/LicensesFieldArray';

export default class AgreementFormAllLicenses extends React.Component {
  render() {
    return (
      <Accordion
        id="licenses-form-all-licenses"
        label={<FormattedMessage id="ui-agreements.license.allLicenses" />}
      >
        <FieldArray
          component={LicensesFieldArray}
          name="licenses"
        />
      </Accordion>
    );
  }
}
