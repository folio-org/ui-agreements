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

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import LicenseLookup from './LicenseLookup';
import css from './LicensesFieldArray.css';

class LicensesFieldArray extends React.Component {
  static propTypes = {
    addLicenseBtnLabel: PropTypes.node,
    isEmptyMessage: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
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

  validateOnlyOneControllingLicense = (value, allValues) => {
    const { controllingLicenseStatusId } = this.state;
    const { name } = this.props;

    if (value === controllingLicenseStatusId) {
      const controllingLicenses = allValues[name].filter(l => l.status === controllingLicenseStatusId);
      if (controllingLicenses.length > 1) {
        return <FormattedMessage id="ui-agreements.license.error.multipleControllingLicenses" />;
      }
    }

    return undefined;
  }

  validateRequired = (value) => (
    !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
  )

  renderLicenses = () => {
    const { items, name, onDeleteField } = this.props;

    return items.map((license, i) => (
      <div className={css.license} key={i}>
        <Row>
          <Col xs={11}>
            <Field
              component={LicenseLookup}
              id={`${name}-remoteId-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.lookup" />}
              license={this.state.licenses[license.remoteId] || license.remoteId_object}
              name={`${name}[${i}].remoteId`}
              onSelectLicense={this.handleLicenseSelected}
              required
              validate={this.validateRequired}
            />
          </Col>
          <Col xs={1}>
            <IconButton
              icon="trash"
              id={`${name}-delete-${i}`}
              onClick={() => onDeleteField(i, license)}
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
                  id={`${name}-status-${i}`}
                  label={<FormattedMessage id="ui-agreements.license.prop.status" />}
                  name={`${name}[${i}].status`}
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
              id={`${name}-note-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.note" />}
              name={`${name}[${i}].note`}
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
    const { items, onAddField } = this.props;

    return (
      <div>
        <div>
          { items.length ? this.renderLicenses() : this.renderEmpty() }
        </div>
        <Button id="add-license-btn" onClick={() => onAddField({})}>
          { this.props.addLicenseBtnLabel }
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(LicensesFieldArray);
