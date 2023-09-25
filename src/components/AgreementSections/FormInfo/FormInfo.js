import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import orderBy from 'lodash/orderBy';

import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';
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
  getRefdataValuesByDesc,
  requiredValidator,
  useAsyncValidation,
} from '@folio/stripes-erm-components';

import { validationEndPoint, statuses } from '../../../constants';
import ContentTypesFieldArray from '../ContentTypesFieldArray';
import AgreementPeriodsFieldArray from '../../AgreementPeriodsFieldArray';
import { useAgreementsRefdata } from '../../../hooks';

const [
  AGREEMENT_CONTENT_TYPE
] = [
  'SubscriptionAgreement.ContentType',
];

const FormInfo = ({
  data: {
    agreementStatusValues = [],
    isPerpetualValues = [],
    reasonForClosureValues = [],
    renewalPriorityValues = []
  },
  form: {
    change,
    mutators
  },
  initialValues,
  values
}) => {
  // deal with this in a second
  const validateAsyncBackend = useAsyncValidation('ui-agreements', validationEndPoint.AGREEMENTPATH);
  const refdata = useAgreementsRefdata({
    desc: [
      AGREEMENT_CONTENT_TYPE,
    ]
  });
  const contentTypeValues = getRefdataValuesByDesc(refdata, AGREEMENT_CONTENT_TYPE);

  const agreementContentTypes = orderBy([
    ...(initialValues?.agreementContentTypes ?? []),
    ...contentTypeValues
      // Filter out options already in agreement
      .filter(ct => !initialValues.agreementContentTypes.some(valAct => valAct.contentType.id === ct.id))
      // Map the rest to the right shape
      .map(ct => ({
        contentType: {
          id: ct.id,
          value: ct.value,
          label: ct.label
        }
      }))
  ], 'contentType.label');

  console.log("FORM VALUES: %o", values)
  console.log("Content type VALUES: %o", agreementContentTypes)

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
{/*       <FieldArray
        component={ContentTypesFieldArray}
        name="agreementContentTypes"
      /> */}
      <Field
        component={MultiSelection}
        dataOptions={agreementContentTypes}
        formatter={({ option }) => {
          if (!option?._delete) {
            return option?.contentType?.label;
          }

          return null;
        }}
        id="agreementContentTypes"
        itemToString={item => {
          if (!item?._delete) {
            return item?.contentType?.label;
          }

          return null;
        }}
        name="agreementContentTypes"
        onChange={(selectedItems) => {
          // All items which were selected in initialValues but are not longer selected
          const previouslySetContentTypes = [
            // Those that have been deleted already
            ...selectedItems?.filter(si => (
              si?._delete &&
              !selectedItems?.some(internalSI => internalSI.id === si.id && !internalSI._delete)
            )),
            // Those that were removed in this onChange
            ...initialValues.agreementContentTypes?.filter(ivct => {
              return !selectedItems?.some(sict => sict.contentType.value === ivct.contentType.value);
            })
          ];

          change('agreementContentTypes', [
            ...selectedItems?.filter(si => !si?._delete),
            ...previouslySetContentTypes.map(psct => ({
              ...psct,
              _delete: true
            }))
          ]);
        }}
        // FIXME this is not called when clicking in options list OR when x is clicked on chip
        /* onRemove={(removedItem) => {
          if (removedItem?.id) {
            change(
              'agreementContentTypes',
              [
                ...values?.agreementContentTypes?.filter(item => item?.id !== removedItem.id),
                { ...removedItem, _delete: true }
              ]
            );
          }
        }} */
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
