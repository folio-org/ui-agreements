import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Button, Col, Layout, Row, Select, TextArea } from '@folio/stripes/components';
import { composeValidators, requiredValidator, EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import AmendmentsFieldArray from './AmendmentsFieldArray';
import LicenseField from './LicenseField';

const CONTROLLING_STATUS = 'controlling';

class LicensesFieldArray extends React.Component {
  static propTypes = {
    amendmentStatusValues: PropTypes.arrayOf(PropTypes.object),
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onMarkForDeletion: PropTypes.func.isRequired,
    onReplaceField: PropTypes.func.isRequired,
    licenseStatusValues: PropTypes.arrayOf(PropTypes.object),
  };

  state = {
    licenses: {},
  }

  handleLicenseSelected = (index, license = {}) => {
    const amendments = (license.amendments || []).map(a => ({
      amendmentId: a.id,
    }));

    this.props.onReplaceField(index, {
      amendments,
      remoteId: license.id,
    });

    this.setState(prevState => ({
      licenses: {
        ...prevState.licenses,
        [license.id]: license,
      }
    }));
  }

  handleLicenseUnselected = (index, license) => {
    /* handleLicenseUnselected should mark the license to be deleted once we update the form.
    onMarkForDeletion does that job. It pushes the {id: id, _delete: true) into the fields array
    and on update would actually delete the field. onReplaceField takes care
    of replacing the linked license UI with the default Add license UI */
    this.props.onMarkForDeletion(license);
    this.props.onReplaceField(index, {});
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter" data-test-license-empty-message>
      <FormattedMessage id="ui-agreements.license.agreementHasNone" />
    </Layout>
  )

  validateOnlyOneControllingLicense = (value, allValues) => {
    const { name } = this.props;

    if (value === CONTROLLING_STATUS) {
      const controllingLicenses = allValues[name].filter(l => l.status === CONTROLLING_STATUS);
      if (controllingLicenses.length > 1) {
        return <FormattedMessage id="ui-agreements.license.error.multipleControllingLicenses" />;
      }
    }

    return undefined;
  }

  renderLicenseFields = () => {
    const {
      amendmentStatusValues,
      licenseStatusValues,
      items,
      name,
      onDeleteField
    } = this.props;

    return items.map((license, index) => (
      <EditCard
        deleteBtnProps={{
          'id': `license-delete-${index}`,
          'data-test-delete-field-button': true
        }}
        header={<FormattedMessage id="ui-agreements.license.licenseIndex" values={{ index: index + 1 }} />}
        id={`${name}-remoteId-${index}-license-card`}
        key={index}
        onDelete={() => onDeleteField(index, license)}
      >
        <Field
          component={LicenseField}
          id={`${name}-remoteId-${index}`}
          index={index}
          license={this.state.licenses[license.remoteId] || license.remoteId_object}
          name={`${name}[${index}].remoteId`}
          onLicenseSelected={selectedLicense => this.handleLicenseSelected(index, selectedLicense)}
          onLicenseUnselected={() => this.handleLicenseUnselected(index, license)}
          validate={requiredValidator}
        />
        <Row>
          <Col xs={12} md={4}>
            <Field
              component={Select}
              dataOptions={licenseStatusValues}
              id={`${name}-status-${index}`}
              key={index}
              label={<FormattedMessage id="ui-agreements.license.prop.status" />}
              name={`${name}[${index}].status`}
              placeholder=" "
              required
              validate={composeValidators(
                this.validateOnlyOneControllingLicense,
                requiredValidator,
              )}
            />
          </Col>
          <Col xs={12} md={8}>
            <Field
              component={TextArea}
              id={`${name}-note-${index}`}
              label={<FormattedMessage id="ui-agreements.license.prop.note" />}
              name={`${name}[${index}].note`}
            />
          </Col>
        </Row>
        <FieldArray
          amendmentStatusValues={amendmentStatusValues}
          license={this.state.licenses[license.remoteId] || license.remoteId_object}
          component={AmendmentsFieldArray}
          name={`${name}[${index}].amendments`}
        />
      </EditCard>
    ));
  }

  render() {
    const { items, onAddField } = this.props;
    return (
      <div data-test-license-fa>
        <div>
          {items.length ? this.renderLicenseFields() : this.renderEmpty()}
        </div>
        <Button
          data-test-license-fa-add-button
          onClick={() => onAddField()}
          id="add-license-btn"
        >
          <FormattedMessage id="ui-agreements.license.addLicense" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(LicensesFieldArray);
