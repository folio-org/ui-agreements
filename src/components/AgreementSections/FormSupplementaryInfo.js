import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class AgreementFormSupplementaryInfo extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { id, handlers, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.supplementaryInfo" />}
        open={open}
        onToggle={onToggle}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-agreements.supplementaryInfo.addSupplementaryInfo" />}
          component={DocumentsFieldArray}
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
          isEmptyMessage={<FormattedMessage id="ui-agreements.supplementaryInfo.agreementHasNone" />}
          name="supplementaryDocs"
        />
      </Accordion>
    );
  }
}
