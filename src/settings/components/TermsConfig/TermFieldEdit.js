import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Button, Card, Col, InfoPopover, Row, Select, TextArea, TextField } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

import { requiredValidator } from '@folio/stripes-erm-components';

export default class TermFieldEdit extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    }),
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  booleanToString = booleanValue => booleanValue.toString()

  stringToBoolean = stringValue => stringValue === 'true'

  render() {
    const {
      input: { name, value = {} },
      meta,
      onCancel,
      onSave,
    } = this.props;

    return (
      <IntlConsumer>
        {intl => (
          <Card
            data-test-term={value.name}
            headerStart={(
              <strong>
                {value.id ?
                  <FormattedMessage id="ui-licenses.settings.terms.editLicenseTerm" /> :
                  <FormattedMessage id="ui-licenses.settings.terms.newLicenseTerm" />}
              </strong>
            )}
            headerEnd={(
              <span>
                <Button
                  data-test-term-cancel-btn
                  marginBottom0
                  onClick={onCancel}
                >
                  <FormattedMessage id="stripes-core.button.cancel" />
                </Button>
                <Button
                  buttonStyle="primary"
                  data-test-term-save-btn
                  disabled={meta.invalid || meta.pristine || meta.submitting}
                  marginBottom0
                  onClick={onSave}
                >
                  <FormattedMessage id="stripes-core.button.save" />
                </Button>
              </span>
            )}
          >
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.label" />}
                  name={`${name}.label`}
                  required
                  startControl={<InfoPopover content={<FormattedMessage id="ui-licenses.settings.terms.help.label" />} />}
                  validate={requiredValidator}
                />
              </Col>
              <Col xs={6}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.name" />}
                  name={`${name}.name`}
                  required
                  startControl={<InfoPopover content={<FormattedMessage id="ui-licenses.settings.terms.help.name" />} />}
                  validate={v => {
                    if (v && v.length) {
                      return /^[a-z][a-z0-9]*$/i.test(v) ?
                        undefined : <FormattedMessage id="ui-licenses.errors.termNameHasNonAlpha" />;
                    }

                    return requiredValidator(v);
                  }}
                />
              </Col>
            </Row>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-licenses.settings.terms.term.description" />}
              name={`${name}.description`}
              required
              validate={requiredValidator}
            />
            <Row>
              <Col xs={4}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.orderWeight" />}
                  name={`${name}.weight`}
                  required
                  validate={requiredValidator}
                  type="number"
                />
              </Col>
              <Col xs={4}>
                <Field
                  component={Select}
                  dataOptions={[
                    { label: intl.formatMessage({ id: 'ui-licenses.yes' }), value: 'true' },
                    { label: intl.formatMessage({ id: 'ui-licenses.no' }), value: 'false' },
                  ]}
                  format={this.booleanToString}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.primaryTerm" />}
                  name={`${name}.primary`}
                  parse={this.stringToBoolean}
                  required
                  validate={requiredValidator}
                />
              </Col>
              <Col xs={4}>
                <Field
                  component={Select}
                  dataOptions={[
                    { label: intl.formatMessage({ id: 'ui-licenses.term.internalTrue' }), value: 'true' },
                    { label: intl.formatMessage({ id: 'ui-licenses.term.internalFalse' }), value: 'false' },
                  ]}
                  format={this.booleanToString}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.defaultVisibility" />}
                  name={`${name}.defaultInternal`}
                  parse={this.stringToBoolean}
                  required
                  validate={requiredValidator}
                />
              </Col>
            </Row>
            { /* Users can only configure the type of a term when creating it, not when editing it */}
            {value.id === undefined &&
              <Field
                component={Select}
                dataOptions={[
                  { label: '', value: '' },
                  { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.decimal' }), value: 'Decimal' },
                  { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.integer' }), value: 'Integer' },
                  { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.text' }), value: 'Text' },
                ]}
                label={<FormattedMessage id="ui-licenses.settings.terms.term.type" />}
                name={`${name}.type`}
                required
                validate={requiredValidator}
              />
            }
          </Card>
        )}
      </IntlConsumer>
    );
  }
}
