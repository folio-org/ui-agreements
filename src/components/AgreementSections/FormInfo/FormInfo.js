import { useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  MultiSelection,
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

import AgreementPeriodsFieldArray from '../../AgreementPeriodsFieldArray';
import { isEqual } from 'lodash';

const FormInfo = ({
  data: {
    agreementStatusValues = [],
    contentTypeValues = [],
    isPerpetualValues = [],
    reasonForClosureValues = [],
    renewalPriorityValues = []
  },
  form: {
    mutators,
    change,
  },
  values,
  id
}) => {
  console.log("VALUES: %o", values?.agreementContentTypes)
  const validateAsyncBackend = useAsyncValidation('ui-agreements', validationEndPoint.AGREEMENTPATH);

  const reducer = (state, action) => {
    const curClone = state?.options;
    const index = curClone.findIndex(o => action?.payload.value === o.value);

    switch (action?.type) {
      case 'removed':
        curClone[index]._delete = true;
        delete curClone[index]._added;
        return {
          options: curClone,
          value: curClone.filter((v) => v._added)
        };
      case 'added':
        curClone[index]._added = true;
        delete curClone[index]._delete;

        return {
          options: curClone,
          value: curClone.filter((v) => v._added)
        };
      default:
        throw new Error();
    }
  };

  const [contentTypeValueState, contentTypeValueDispatch] = useReducer(
    reducer,
    {
      options: contentTypeValues?.map(act => ({
        value: act.value,
        label: act.label,
        contentType: act,
        // Make sure we have "added" any that come in from the database
        _added: !!values?.agreementContentTypes?.find(vact => vact?.contentType?.value === act?.value)
      })),
      value: values?.agreementContentTypes?.map(act => ({
        ...act,
        // Introduce value/label here so we know what's already selected
        value: act?.contentType?.value,
        label: act?.contentType?.label,
      }))
    }
  );

  console.log("contentTypeValueState: %o", contentTypeValueState?.value)
  console.log("contentTypeValueState options: %o", contentTypeValueState?.options)

  return (
    <div data-test-edit-agreement-info>
      <Row>
        <Col xs={12}>
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
      </Row>
      <Row>
        <Col md={8} xs={12}>
          <Field
            component={TextArea}
            id="edit-agreement-description"
            label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}
            name="description"
            parse={v => v} // Lets us send an empty string instead of `undefined`
          />
        </Col>
        <Col xs={4}>
          {
            /* FIXME This is a spearate componet rather than
             * being inside the "render" of the field because weird crap
             * was happening
             */
          }
          <Field
            name="agreementContentTypes"
            render={({ input: { onChange } }) => (
              <MultiSelection
                key={id}
                dataOptions={contentTypeValueState.options}
                id="edit-agreement-content-types"
                label={<FormattedMessage id="ui-agreements.agreements.agreementContentType" />}
                onAdd={item => {
                  const currentValues = values?.agreementContentTypes;
                  console.log("Current values: %o", currentValues)

                  // Does item.value exist in currentValues?
                  const relevantValueIndex = currentValues?.findIndex(cv => (
                    cv?.contentType?.value === item?.value ||
                    cv?.contentType === item?.value
                  ));

                  if (relevantValueIndex === -1) {
                    onChange([...currentValues, { contentType: item?.value }]);
                  } else if (currentValues[relevantValueIndex]?._delete) {
                    // If it was deleted by mistake, simply "undo" delete by passing id
                    onChange([...currentValues?.splice(relevantValueIndex, 1), { id: currentValues[relevantValueIndex].id }]);
                  }

                  contentTypeValueDispatch({ type: 'added', payload: item });
                }}
                onRemove={item => {
                  const currentValues = values?.agreementContentTypes;
                  console.log("Current values: %o", currentValues)

                  // Does item.value exist in currentValues?
                  const relevantValueIndex = currentValues?.findIndex(cv => (
                    cv?.contentType?.value === item?.value ||
                    cv?.contentType === item?.value
                  ));

                  // Find and remove from values.
                  if (relevantValueIndex !== -1) {
                    onChange([...currentValues?.splice(relevantValueIndex, 1), { id: currentValues[relevantValueIndex].id, _delete: true }]);
                  }
                  contentTypeValueDispatch({ type: 'removed', payload: item });
                }}
                parse={v => v} // Lets us send an empty string instead of `undefined`
                value={contentTypeValueState.value}
                /*
                  * ValueFormatter passes the item inside a property called `option`
                  */
                valueFormatter={({ option: item }) => {
                  const contentTypeValue = item?.contentType?.value ?? item?.value;
                  const relevantRefdata = contentTypeValues?.find(val => val?.value === contentTypeValue);
                  return relevantRefdata?.label ?? relevantRefdata?.value;
                }}
              />
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} xs={12}>
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
        <Col md={6} xs={12}>
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
      </Row>
      <Row>
        <Col md={6} xs={12}>
          <Field
            component={Select}
            dataOptions={[{ value: '', label: '' }, ...renewalPriorityValues]}
            id="edit-agreement-renewal-priority"
            label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}
            name="renewalPriority"
            parse={v => v} // Lets us pass an empty string instead of `undefined`
          />
        </Col>
        <Col md={6} xs={12}>
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
    contentTypeValues: PropTypes.arrayOf(PropTypes.object),
    reasonForClosureValues: PropTypes.arrayOf(PropTypes.object),
    renewalPriorityValues: PropTypes.arrayOf(PropTypes.object),
    isPerpetualValues: PropTypes.arrayOf(PropTypes.object),
  }),
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setFieldData: PropTypes.func.isRequired,
    }).isRequired,
    change: PropTypes.func,
    remove: PropTypes.object,
  }),
  initialValues: PropTypes.object,
  values: PropTypes.object,
};

export default FormInfo;
