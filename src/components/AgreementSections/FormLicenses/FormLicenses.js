import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion, Headline, KeyValue, TextArea } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { DocumentsFieldArray, useFileHandlers } from '@folio/stripes-erm-components';

import LicensesFieldArray from '../../LicensesFieldArray';

const FormLicenses = ({
  data,
  form,
  id,
  onToggle,
  open,
}) => {
  const stripes = useStripes();
  const { handleDownloadFile, handleUploadFile } = useFileHandlers('erm/files');

  const renderNote = () => (
    <Field
      component={TextArea}
      id="edit-agreement-licenseNote"
      label={<FormattedMessage id="ui-agreements.license.generalNotes" />}
      maxLength={255}
      name="licenseNote"
      parse={v => v} // Lets us send an empty string instead of `undefined`
    />
  );

  const renderLinkedLicenses = () => (
    <div data-test-licenses-form-all-licenses>
      <KeyValue
        label={
          <Headline margin="x-small" size="large" tag="h4">
            <FormattedMessage id="ui-agreements.license.allLicenses" />
          </Headline>
        }
      >
        <FieldArray
          amendmentStatusValues={data.amendmentStatusValues}
          component={LicensesFieldArray}
          form={form}
          licenseStatusValues={data.licenseLinkStatusValues}
          name="linkedLicenses"
        />
      </KeyValue>
    </div>
  );

  const renderExternalLicenses = () => {
    return (
      <div data-test-licenses-form-external-licenses>
        <KeyValue
          label={
            <Headline margin="x-small" size="large" tag="h4">
              <FormattedMessage id="ui-agreements.license.externalLicenses" />
            </Headline>
          }
        >
          <FieldArray
            addDocBtnLabel={<FormattedMessage id="ui-agreements.license.addExternalLicense" />}
            component={DocumentsFieldArray}
            deleteBtnTooltipMsgId="ui-agreements.doc.removeExternalLicense"
            hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
            isEmptyMessage={<FormattedMessage id="ui-agreements.license.noExternalLicenses" />}
            name="externalLicenseDocs"
            onDownloadFile={handleDownloadFile}
            onUploadFile={handleUploadFile}
          />
        </KeyValue>
      </div>
    );
  };

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-agreements.agreements.licenseInfo" />}
      onToggle={onToggle}
      open={open}
    >
      {renderNote()}
      {renderLinkedLicenses()}
      {renderExternalLicenses()}
    </Accordion>
  );
};

FormLicenses.propTypes = {
  data: PropTypes.shape({
    agreement: PropTypes.object,
    amendmentStatusValues: PropTypes.arrayOf(PropTypes.object),
    licenseLinkStatusValues: PropTypes.arrayOf(PropTypes.object),
  }),
  form: PropTypes.object,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default FormLicenses;
