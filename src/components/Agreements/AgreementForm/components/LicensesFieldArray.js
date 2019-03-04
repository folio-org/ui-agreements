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
  TextField,
  IconButton,
} from '@folio/stripes/components';

import LicenseLookup from './LicenseLookup';
import css from './LicensesFieldArray.css';

export default class LicensesFieldArray extends React.Component {
  static propTypes = {
    addLicenseBtnLabel: PropTypes.node,
    fields: PropTypes.object,
    isEmptyMessage: PropTypes.node,
  }

  static defaultProps = {
    addLicenseBtnLabel: <FormattedMessage id="ui-agreements.license.addLicense" />,
    isEmptyMessage: <FormattedMessage id="ui-agreements.license.noLicenses" />,
  }

  handleDeleteLicense = (index, license) => {
    const { fields } = this.props;

    fields.remove(index);

    if (license.id) {
      fields.push({ id: license.id, _delete: true });
    }
  }

  validateDocIsSpecified = (value, allValues, props, name) => {
    const index = parseInt(/\[([0-9]*)\]/.exec(name)[1], 10);
    const { location, url } = get(allValues, [this.props.fields.name, index], {});
    if (!location && !url) {
      return <FormattedMessage id="stripes-erm-components.doc.error.docsMustHaveLocationOrURL" />;
    }

    return undefined;
  }

  validateRequired = (value) => (
    !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
  )

  renderLicenses = (licenses) => {
    return licenses.map((license, i) => (
      <div className={css.license}>
        <Row>
          <Col xs={11}>
            <Field
              component={LicenseLookup}
              id={`licenses-id-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.lookup" />}
              name={`licenses[${i}].id`}
              required
              validate={this.validateRequired}
            />
          </Col>
          <Col xs={1}>
            <IconButton
              icon="trash"
              id={`licenses-delete-${i}`}
              onClick={() => this.handleDeleteLicense(i, license)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Field
              component={Select}
              dataOptions={[
                { label: 'Controlling' }, { label: 'Future' }, { label: 'Historical' }
              ]}
              id={`licenses-status-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.status" />}
              name={`licenses[${i}].status`}
              required
              validate={this.validateRequired}
            />
          </Col>
          <Col xs={8}>
            <Field
              component={TextArea}
              id={`licenses-note-${i}`}
              label={<FormattedMessage id="ui-agreements.license.prop.note" />}
              name={`licenses[${i}].note`}
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
