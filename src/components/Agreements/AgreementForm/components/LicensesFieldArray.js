import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  Layout,
  Row,
  Select,
  TextArea,
  IconButton,
} from '@folio/stripes/components';

import LicenseLookup from './LicenseLookup';
import css from './LicensesFieldArray.css';

export default class LicensesFieldArray extends React.Component {
  static propTypes = {
    addLicenseBtnLabel: PropTypes.node,
    fields: PropTypes.object,
    isEmptyMessage: PropTypes.node,
    parentResources: PropTypes.object,
  }

  static defaultProps = {
    addLicenseBtnLabel: <FormattedMessage id="ui-agreements.license.addLicense" />,
    isEmptyMessage: <FormattedMessage id="ui-agreements.license.noLicenses" />,
  }

  state = {
    controllingLicenseStatusId: undefined,
    licenses: {},
    statusValues: [],
  }

  static getDerivedStateFromProps(nextProps, state) {
    const statusValues = get(nextProps.parentResources.licenseLinkStatusValues, ['records'], []);
    if (state.statusValues.length !== statusValues.length) {
      return {
        controllingLicenseStatusId: (statusValues.find(v => v.value === 'controlling') || {}).id,
        statusValues: statusValues.map(({ id, label }) => ({ value: id, label })),
      };
    }

    return null;
  }

  handleLicenseSelected = (license) => {
    this.setState(prevState => ({
      licenses: {
        ...prevState.licenses,
        [license.id]: license,
      }
    }));
  }

  handleDeleteLicense = (index, license) => {
    const { fields } = this.props;

    fields.remove(index);

    if (license.id) {
      fields.push({ id: license.id, _delete: true });
    }
  }

  validateOnlyOneControllingLicense = (value, allValues) => {
    const { controllingLicenseStatusId } = this.state;
    const { fields: { name } } = this.props;

    if (value === controllingLicenseStatusId) {
      const controllingLicenses = allValues[name].filter(l => l.status === controllingLicenseStatusId);
      if (controllingLicenses.length > 1) {
        return <FormattedMessage id="ui-agreements.license.error.multipleControllingLicenses" />;
      }
    }
  }

  validateRequired = (value) => (
    !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
  )

  renderLicenses = (licenses) => {
    const { fields } = this.props;

    return licenses.map((license, i) => (
      <div className={css.license} key={i}>
        <Row>
          <Col xs={11}>
            <Field
              component={LicenseLookup}
              id={`${fields.name}-remoteId-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.lookup" />}
              license={this.state.licenses[license.remoteId]}
              name={`${fields.name}[${i}].remoteId`}
              onSelectLicense={this.handleLicenseSelected}
              required
              validate={this.validateRequired}
            />
          </Col>
          <Col xs={1}>
            <IconButton
              icon="trash"
              id={`${fields.name}-delete-${i}`}
              onClick={() => this.handleDeleteLicense(i, license)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <FormattedMessage id="ui-agreements.license.selectStatus">
              {placeholder => (
                <Field
                  component={Select}
                  dataOptions={this.state.statusValues}
                  id={`${fields.name}-status-${i}`}
                  label={<FormattedMessage id="ui-agreements.license.prop.status" />}
                  name={`${fields.name}[${i}].status`}
                  placeholder={placeholder}
                  required
                  validate={[
                    this.validateOnlyOneControllingLicense,
                    this.validateRequired,
                  ]}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={8}>
            <Field
              component={TextArea}
              id={`${fields.name}-note-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.note" />}
              name={`${fields.name}[${i}].note`}
            />
          </Col>
        </Row>
      </div>
    ));
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      { this.props.isEmptyMessage }
    </Layout>
  )

  render() {
    const { fields } = this.props;
    const licenses = (this.props.fields.getAll() || [])
      .filter(d => d._delete !== true);

    return (
      <div>
        <div>
          { licenses.length ? this.renderLicenses(licenses) : this.renderEmpty() }
        </div>
        <Button id="add-license-btn" onClick={() => fields.push({})}>
          { this.props.addLicenseBtnLabel }
        </Button>
      </div>
    );
  }
}
