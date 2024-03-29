import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray, useFileHandlers } from '@folio/stripes-erm-components';
import { useStripes } from '@folio/stripes/core';

const FormSupplementaryDocuments = ({ data, id, onToggle, open }) => {
  const stripes = useStripes();

  const { handleDownloadFile, handleUploadFile } = useFileHandlers('erm/files');

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-agreements.supplementaryDocuments" />}
      onToggle={onToggle}
      open={open}
    >
      <FieldArray
        addDocBtnLabel={<FormattedMessage id="ui-agreements.supplementaryDocs.addSupplementaryDoc" />}
        component={DocumentsFieldArray}
        deleteBtnTooltipMsgId="ui-agreements.doc.removeSupplementaryInformation"
        documentCategories={data.documentCategories}
        hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
        isEmptyMessage={<FormattedMessage id="ui-agreements.supplementaryDocs.agreementHasNone" />}
        name="supplementaryDocs"
        onDownloadFile={handleDownloadFile}
        onUploadFile={handleUploadFile}
      />
    </Accordion>
  );
};

FormSupplementaryDocuments.propTypes = {
  data: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool
};

export default FormSupplementaryDocuments;
