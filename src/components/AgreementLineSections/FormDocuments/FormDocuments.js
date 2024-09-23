import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray, useFileHandlers } from '@folio/stripes-erm-components';
import { useStripes } from '@folio/stripes/core';

const FormDocuments = ({ line, id, onToggle, open }) => {
  const stripes = useStripes();
  const { handleDownloadFile, handleUploadFile } = useFileHandlers('erm/files');
  console.log('line %O:', line);
  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-agreements.line.documents" />}
      onToggle={onToggle}
      open={open}
    >
      <FieldArray
        addDocBtnLabel={<FormattedMessage id="ui-agreements.documents.addDocs" />}
        component={DocumentsFieldArray}
        deleteBtnTooltipMsgId="ui-agreements.doc.removeDocsInformation"
        documentCategories={line}
        hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
        isEmptyMessage={
          <FormattedMessage id="ui-agreements.emptyAccordion.documents" />
        }
        name="docs"
        onDownloadFile={handleDownloadFile}
        onUploadFile={handleUploadFile}
      />
    </Accordion>
  );
};

FormDocuments.propTypes = {
  line: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default FormDocuments;
