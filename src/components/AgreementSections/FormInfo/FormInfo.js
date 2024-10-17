import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { IconSelect, RichSelect, useSelectedOption } from '@k-int/stripes-kint-components';

import {
  Col,
  IconButton,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import {
  AlternativeNamesFieldArray,
  composeValidators,
  requiredValidator,
  useAsyncValidation,
} from '@folio/stripes-erm-components';

import { validationEndPoint, statuses } from '../../../constants';
import ContentTypesFieldArray from '../ContentTypesFieldArray';
import AgreementPeriodsFieldArray from '../../AgreementPeriodsFieldArray';

import css from './FormInfo.css';

const FormInfo = ({
  data: {
    agreementStatusValues = [],
    isPerpetualValues = [],
    reasonForClosureValues = [],
    renewalPriorityValues = []
  },
  form: {
    mutators
  },
  values
}) => {
  // deal with this in a second
  const validateAsyncBackend = useAsyncValidation('ui-agreements', validationEndPoint.AGREEMENTPATH);
  const [richSelectRef, selectedOption] = useSelectedOption();
  console.log("SelectedOption: %o", selectedOption);

  const [iconSelectRef, selectedOptionIcon] = useSelectedOption();
  console.log("SelectedOption (icon): %o", selectedOptionIcon);

  return (
    <div data-test-edit-agreement-info>
      <Row>
        <Col xs={10}>
          <Field
            autoFocus
            component={TextField}
            id="edit-agreement-name"
            label={<FormattedMessage id="ui-agreements.agreements.name" />}
            maxLength={255}
            name="name"
            required
            validate={composeValidators(
              requiredValidator,
              validateAsyncBackend,
            )}
          />
        </Col>
        <Col xs={2}>
          <Field
            ref={iconSelectRef}
            component={IconSelect}
            label="IconSelect"
            name="agreementStatus"
            options={[
              {
                icon: "trash",
                value: "active",
                label: "ACTIVE",
                iconProps: {
                  iconClassName: css.trashIcon
                },
                buttonProps: {
                  className: css.buttonStyle1
                }
              },
              {
                icon: "comment",
                value: "closed",
                label: "CLOSED",
                buttonProps: {
                  className: css.buttonStyle1
                }
              }
            ]}
            parse={v => v}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Field
            label="RichSelect"
            name="agreementStatus"
            parse={v => v}
            render={fieldProps => (
              <RichSelect
                {...fieldProps}
                ref={richSelectRef}
                options={[
                  {
                    icon: "trash",
                    value: "active",
                    label: "Active (label)",
                    iconProps: {
                      iconClassName: css.trashIcon
                    },
                  },
                  {
                    value: "closed",
                    label: "Closed (label)",
                    buttonProps: {
                      className: css.buttonStyle1
                    }
                  }
                ]}
                required
              />
            )}
          />
        </Col>
        <Col xs={2}>
          <IconButton
            icon="caret-right"
            iconPosition="end"
            onClick={() => alert("CLICKED")}
          >
            IconButton
          </IconButton>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextArea}
            id="edit-agreement-description"
            label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}
            name="description"
            parse={v => v} // Lets us send an empty string instead of `undefined`
          />
        </Col>
      </Row>
      <Row>
        <Col md={3} xs={12}>
          <Field name="agreementStatus" validate={requiredValidator}>
            {({ input, meta }) => {
              return (
                <Select
                  {...input}
                  dataOptions={agreementStatusValues}
                  error={meta && meta.touched && meta.error}
                  id="edit-agreement-status"
                  label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
                  onChange={(e) => {
                    input.onChange(e);
                    let warning;

                    if (values.reasonForClosure && e.target.value !== statuses.CLOSED) {
                      warning = <FormattedMessage id="ui-agreements.warn.clearReasonForClosure" />;
                    }
                    mutators.setFieldData('reasonForClosure', { warning });
                  }}
                  placeholder=" "
                  required
                />
              );
            }}
          </Field>
        </Col>
        <Col md={3} xs={12}>
          <Field
            component={Select}
            dataOptions={[{ value: '', label: '' }, ...reasonForClosureValues]}
            disabled={values.agreementStatus !== statuses.CLOSED}
            id="edit-agreement-reason-for-closure"
            label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}
            name="reasonForClosure"
            parse={v => v} // Lets us send an empty string instead of `undefined`
          />
        </Col>
        <Col md={3} xs={12}>
          <Field
            component={Select}
            dataOptions={[{ value: '', label: '' }, ...renewalPriorityValues]}
            id="edit-agreement-renewal-priority"
            label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}
            name="renewalPriority"
            parse={v => v} // Lets us pass an empty string instead of `undefined`
          />
        </Col>
        <Col md={3} xs={12}>
          <Field
            component={Select}
            dataOptions={[{ value: '', label: '' }, ...isPerpetualValues]}
            id="edit-agreement-is-perpetual"
            label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}
            name="isPerpetual"
            parse={v => v} // Lets us pass an empty string instead of `undefined`
          />
        </Col>
      </Row>
      <FieldArray
        component={ContentTypesFieldArray}
        name="agreementContentTypes"
      />
      <FieldArray
        component={AlternativeNamesFieldArray}
        name="alternateNames"
      />
      <FieldArray
        component={AgreementPeriodsFieldArray}
        name="periods"
      />
    </div>
  );
};

FormInfo.propTypes = {
  data: PropTypes.shape({
    agreementStatusValues: PropTypes.arrayOf(PropTypes.object),
    reasonForClosureValues: PropTypes.arrayOf(PropTypes.object),
    renewalPriorityValues: PropTypes.arrayOf(PropTypes.object),
    isPerpetualValues: PropTypes.arrayOf(PropTypes.object),
  }),
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setFieldData: PropTypes.func.isRequired,
    }).isRequired,
  }),
  initialValues: PropTypes.object,
  values: PropTypes.object,
};

export default FormInfo;
