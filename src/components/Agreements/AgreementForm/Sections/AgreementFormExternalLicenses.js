import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import { KeyValue } from '@folio/stripes/components';
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
      <div data-test-licenses-form-external-licenses>
        <KeyValue label={<FormattedMessage id="ui-agreements.license.externalLicenses" />}>
          <FieldArray
            addDocBtnLabel={<FormattedMessage id="ui-agreements.license.addExternalLicense" />}
            component={DocumentsFieldArray}
            onDownloadFile={handlers.onDownloadFile}
            onUploadFile={handlers.onUploadFile}
            isEmptyMessage={<FormattedMessage id="ui-agreements.license.noExternalLicenses" />}
            name="externalLicenseDocs"
          />
        </KeyValue>
      </div>
    );
  }
}
