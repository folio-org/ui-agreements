import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useLocation, useHistory } from 'react-router-dom';
import { Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import {
  composeValidators,
  requiredValidator,
  useAsyncValidation,
  getRefdataValuesByDesc,
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
import { AGREEMENTS_ENDPOINT } from '../../constants/endpoints';
import { useBasket, useAgreementsRefdata } from '../../hooks';
import { urls } from '../utilities';

const propTypes = {
  showModal: PropTypes.bool,
  hideModal: PropTypes.func,
  selectedItems: PropTypes.func,
  agreementStatusValues: PropTypes.arrayOf(PropTypes.object),
  handleAgreement: PropTypes.func,
};
const [AGREEMENT_STATUS] = ['SubscriptionAgreement.AgreementStatus'];

const AgreementModal = ({ showModal, hideModal, selectedItems }) => {
  const location = useLocation();
  const history = useHistory();
  const ky = useOkapiKy();
  const refdata = useAgreementsRefdata({
    desc: [AGREEMENT_STATUS],
  });

  const { basket } = useBasket();

  const validateAsyncBackend = useAsyncValidation(
    'ui-agreements',
    validationEndPoint.AGREEMENTPATH
  );

  const { mutateAsync: postAgreement } = useMutation(
    [
      AGREEMENTS_ENDPOINT,
      'ui-agreements',
      'AgreementCreateRoute',
      'createAgreement',
    ],
    (payload) => ky
      .post(AGREEMENTS_ENDPOINT, { json: payload })
      .json()
      .then(({ id }) => {
        history.push(`${urls.agreementView(id)}${location.search}`);
      })
  );

  const handleAddToNewAgreement = async (values) => {
    const submitValues = {
      name: values?.name,
      agreementStatus: values?.agreementStatus,
      periods: [{ startDate: values?.startDate }],
      items: selectedItems
        .split(',')
        .map((index) => ({ resource: basket[parseInt(index, 10)] }))
        .filter((line) => line.resource),
    };
    await postAgreement(submitValues);
  };

  return (
    <FormModal
      modalProps={{
        onClose: hideModal,
        open: showModal,
        label: (
          <FormattedMessage id="ui-agreements.agreements.createAgreement" />
        ),
      }}
      mutators={arrayMutators}
      onSubmit={handleAddToNewAgreement}
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
                  dataOptions={getRefdataValuesByDesc(
                    refdata,
                    AGREEMENT_STATUS
                  )}
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
