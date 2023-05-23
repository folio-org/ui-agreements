import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  composeValidators,
  requiredValidator,
  useAsyncValidation,
} from '@folio/stripes-erm-components';

import {
  Row,
  Col,
  TextField,
  Select,
  Datepicker,
} from '@folio/stripes/components';

import { FormModal } from '@k-int/stripes-kint-components';
import { validationEndPoint } from '../../constants';

const propTypes = {
  showModal: PropTypes.bool,
  hideModal: PropTypes.func,
  selectedItems: PropTypes.func,
  agreementStatusValues: PropTypes.arrayOf(PropTypes.object),
  handleAgreement: PropTypes.func,
};

const AgreementModal = ({
  showModal,
  hideModal,
  selectedItems,
  agreementStatusValues,
  handleAgreement,
}) => {
  const validateAsyncBackend = useAsyncValidation(
    'ui-agreements',
    validationEndPoint.AGREEMENTPATH
  );

  const submitAgreement = async (values) => {
    await handleAgreement(selectedItems, values);
    hideModal();
  };

  return (
    <FormModal
      modalProps={{
        onClose: hideModal,
        open: showModal,
        label: <FormattedMessage id="ui-agreements.agreements.createAgreement" />,
      }}
      mutators={arrayMutators}
      onSubmit={submitAgreement}
    >
      <Row>
        <Col xs={4}>
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
              validateAsyncBackend
            )}
          />
        </Col>
        <Col xs={4}>
          <Field name="agreementStatus" validate={requiredValidator}>
            {({ input, meta }) => {
              return (
                <Select
                  {...input}
                  dataOptions={agreementStatusValues}
                  error={meta && meta.touched && meta.error}
                  id="edit-agreement-status"
                  label={
                    <FormattedMessage id="ui-agreements.agreements.agreementStatus" />
                  }
                  onChange={(e) => {
                    input.onChange(e);
                  }}
                  placeholder=" "
                  required
                />
              );
            }}
          </Field>
        </Col>
        <Col xs={4}>
          <Field
            backendDateStandard="YYYY-MM-DD"
            component={Datepicker}
            id="period-start-date"
            label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
            name="startDate"
            required
            timeZone="UTC"
            usePortal
            validate={requiredValidator}
          />
        </Col>
      </Row>
    </FormModal>
  );
};

AgreementModal.propTypes = propTypes;

export default AgreementModal;
