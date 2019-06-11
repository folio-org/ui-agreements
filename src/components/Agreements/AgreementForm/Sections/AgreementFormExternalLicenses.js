import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class AgreementFormExternalLicenses extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
  };

  render() {
    const { handlers } = this.props;
    return (
      <Accordion
        id="licenses-form-external-licenses"
        label={<FormattedMessage id="ui-agreements.license.externalLicenses" />}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-agreements.license.addExternalLicense" />}
          component={DocumentsFieldArray}
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
          isEmptyMessage={<FormattedMessage id="ui-agreements.license.noExternalLicenses" />}
          name="externalLicenseDocs"
        />
      </Accordion>
    );
  }
}
