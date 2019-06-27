import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, FieldArray } from 'redux-form';

import { Accordion, KeyValue, TextArea } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

import LicensesFieldArray from '../LicensesFieldArray';

export default class AgreementFormLicense extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreement: PropTypes.object,
      licenseLinkStatusValues: PropTypes.array,
    }),
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
      <FieldArray
        component={LicensesFieldArray}
        data={this.props.data}
        name="linkedLicenses"
        validate={this.validateRequired}
      />
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
