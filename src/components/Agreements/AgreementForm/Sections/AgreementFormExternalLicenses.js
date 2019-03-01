import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class AgreementFormExternalLicenses extends React.Component {
  render() {
    return (
      <Accordion
        id="licenses-form-external-licenses"
        label={<FormattedMessage id="ui-agreements.license.externalLicenses" />}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-agreements.license.addExternalLicense" />}
          component={DocumentsFieldArray}
          isEmptyMessage={<FormattedMessage id="ui-agreements.coreDocs.noExternalLicenses" />}
          name="externalLicenseDocs"
        />
      </Accordion>
    );
  }
}
