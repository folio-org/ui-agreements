import { useEffect, useState } from 'react';
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
    remove
  },
  values,
  id
}) => {
  console.log("VALUES: %o", values?.agreementContentTypes)
  // deal with this in a second
  const validateAsyncBackend = useAsyncValidation('ui-agreements', validationEndPoint.AGREEMENTPATH);
  /* const [item, setItem] = useState(contentTypeValues);

  const removeItem = (id) => {
    const newItemList = item.filter((i) => i.id !==id);
    setItem(newItemList);
  } */

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
          <Field
            name="agreementContentTypes"
            render={({ input: { onChange, value } }) => (
              <MultiSelection
                key={id}
                dataOptions={contentTypeValues}
                id="edit-agreement-content-types"
                label={<FormattedMessage id="ui-agreements.agreements.agreementContentType" />}
                onChange={(items) => {
                  console.log("current value: %o", value)
                  console.log("onchange items: %o", items)
                  onChange([
                    ...items?.map(i => {
                      if (i._delete || i.contentType) {
                        return i;
                      }

                      return ({ contentType: i.value });
                    }),
                  ]);
                }}
                onRemove={async item => {
                  console.log("onremove item: %o", item)
                  const currentValues = values?.agreementContentTypes;
                  if (item?.id) {
                    const removedItemIndex = currentValues?.findIndex(val => val?.id === item.id);
                    currentValues[removedItemIndex] = { id: item.id, _delete: true };
                    // This will trigger the onChange handler
                    onChange(currentValues);
                  }
                }}
                parse={v => v} // Lets us send an empty string instead of `undefined`
                value={values?.agreementContentTypes?.filter(v => !v._delete)}
                /*
                 * ValueFormatter passes the item inside a property called `option`
                 */
                valueFormatter={({ option: item }) => {
                  const contentTypeValue = item?.contentType?.value ?? item?.contentType;
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
    change: PropTypes.object,
    remove: PropTypes.object,
  }),
  initialValues: PropTypes.object,
  values: PropTypes.object,
};

export default FormInfo;
