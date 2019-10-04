import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion, KeyValue, TextArea } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

import LicensesFieldArray from '../LicensesFieldArray';

export default class FormLicenses extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreement: PropTypes.object,
      amendmentStatusValues: PropTypes.array,
      licenseLinkStatusValues: PropTypes.array,
    }),
    form: PropTypes.object,
    handlers: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderNote = () => (
    <Field
      maxLength={255}
      id="edit-agreement-licenseNote"
      name="licenseNote"
      label={<FormattedMessage id="ui-agreements.license.generalNotes" />}
      component={TextArea}
    />
  )

  renderLinkedLicenses = () => (
    <div data-test-licenses-form-all-licenses>
      <KeyValue label={<FormattedMessage id="ui-agreements.license.allLicenses" />}>
        <FieldArray
          amendmentStatusValues={this.props.data.amendmentStatusValues}
          component={LicensesFieldArray}
          form={this.props.form}
          licenseStatusValues={this.props.data.licenseLinkStatusValues}
          name="linkedLicenses"
        />
      </KeyValue>
    </div>
  )

  renderExternalLicenses = () => (
    <div data-test-licenses-form-external-licenses>
      <KeyValue label={<FormattedMessage id="ui-agreements.license.externalLicenses" />}>
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-agreements.license.addExternalLicense" />}
          component={DocumentsFieldArray}
          onDownloadFile={this.props.handlers.onDownloadFile}
          onUploadFile={this.props.handlers.onUploadFile}
          isEmptyMessage={<FormattedMessage id="ui-agreements.license.noExternalLicenses" />}
          name="externalLicenseDocs"
        />
      </KeyValue>
    </div>
  )

  render() {
    const {
      id,
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseInfo" />}
        open={open}
        onToggle={onToggle}
      >
        { this.renderNote() }
        { this.renderLinkedLicenses() }
        { this.renderExternalLicenses() }
      </Accordion>
    );
  }
}
