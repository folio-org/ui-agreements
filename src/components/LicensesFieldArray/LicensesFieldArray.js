import React from 'react';
import PropTypes from 'prop-types';
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

const CONTROLLING_STATUS = 'controlling';

class LicensesFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onReplaceField: PropTypes.func.isRequired,
    data: PropTypes.shape({
      licenseLinkStatusValues: PropTypes.array,
    }),
  }

  state = {
    licenses: {},
  }

  handleLicenseSelected = (i, license) => {
    this.props.onReplaceField(i, { remoteId: license.id });

    this.setState(prevState => ({
      licenses: {
        ...prevState.licenses,
        [license.id]: license,
      }
    }));
  }

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

  validateRequired = (value) => (
    !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
  )

  renderLicenses = () => {
    const {
      data: { licenseLinkStatusValues },
      items,
      name,
      onDeleteField
    } = this.props;

    return items.map((license, i) => (
      <div className={css.license} key={i}>
        <Row>
          <Col xs={11}>
            <Field
              component={LicenseLookup}
              id={`${name}-remoteId-${i}`}
              license={this.state.licenses[license.remoteId] || license.remoteId_object}
              name={`${name}[${i}].remoteId`}
              onSelectLicense={newLicense => this.handleLicenseSelected(i, newLicense)}
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
                  dataOptions={licenseLinkStatusValues}
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
      <FormattedMessage id="ui-agreements.license.noLicenses" />
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
          <FormattedMessage id="ui-agreements.license.addLicense" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(LicensesFieldArray);
