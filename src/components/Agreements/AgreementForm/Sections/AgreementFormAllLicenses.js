import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { KeyValue } from '@folio/stripes/components';
import LicensesFieldArray from '../components/LicensesFieldArray';

export default class AgreementFormAllLicenses extends React.Component {
  static propTypes = {
    parentResources: PropTypes.object,
  }

  render() {
    return (
      <div data-test-licenses-form-all-licenses>
        <KeyValue label={<FormattedMessage id="ui-agreements.license.allLicenses" />}>
          <FieldArray
            component={LicensesFieldArray}
            name="linkedLicenses"
            parentResources={this.props.parentResources}
          />
        </KeyValue>
      </div>
    );
  }
}
