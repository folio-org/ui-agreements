import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class FormSupplementaryDocuments extends React.Component {
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
        label={<FormattedMessage id="ui-agreements.agreements.supplementaryDocuments" />}
        open={open}
        onToggle={onToggle}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-agreements.supplementaryDocs.addSupplementaryDoc" />}
          component={DocumentsFieldArray}
          deleteBtnTooltipMsgId="ui-agreements.doc.removeSupplementaryInformation"
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
          isEmptyMessage={<FormattedMessage id="ui-agreements.supplementaryDocs.agreementHasNone" />}
          name="supplementaryDocs"
        />
      </Accordion>
    );
  }
}
