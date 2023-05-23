import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';

import { useBatchedFetch } from '@folio/stripes-erm-components';
import { useOkapiKy } from '@folio/stripes/core';

import { useBasket } from '../../hooks';
import {
  AGREEMENTS_ENDPOINT,
  AGREEMENT_ENDPOINT,
} from '../../constants/endpoints';

import View from '../../components/views/Basket';
import { urls } from '../../components/utilities';

const BasketRoute = ({ history }) => {
  const { basket, removeFromBasket } = useBasket();
  const location = useLocation();
  const ky = useOkapiKy();

  // AGREEMENTS BATCHED FETCH
  const { results: openAgreements } = useBatchedFetch({
    batchParams: {
      filters: [
        {
          path: 'agreementStatus.value',
          values: ['active', 'draft', 'in_negotiation', 'requested'],
        },
      ],
      sort: [{ path: 'name' }],
    },
    nsArray: ['ERM', 'Agreements', AGREEMENTS_ENDPOINT, 'BasketRoute'],
    path: AGREEMENTS_ENDPOINT,
  });

  const { mutateAsync: putAgreement } = useMutation(
    [
      AGREEMENTS_ENDPOINT,
      'ui-agreements',
      'AgreementEditRoute',
      'editAgreement',
    ],
    ({ payload, agreementId }) => ky
      .put(AGREEMENT_ENDPOINT(agreementId), {
        json: payload,
      })
      .json()
      .then(() => {
        history.push(`${urls.agreementView(agreementId)}${location.search}`);
      })
  );

  const handleAddToExistingAgreement = (addFromBasket, agreementId) => {
    const submitValues = {
      payload: {
        items: addFromBasket
          .split(',')
          .map((index) => ({ resource: basket[parseInt(index, 10)] }))
          .filter((line) => line.resource),
      },
      agreementId,
    };
    putAgreement(submitValues);
  };

  const handleAddToNewAgreement = (addFromBasket) => {
    history.push(`${urls.agreementCreate()}?addFromBasket=${addFromBasket}`);
  };

  const handleClose = () => {
    history.goBack();
  };

  return (
    <View
      data={{
        openAgreements,
        basket,
      }}
      handlers={{
        onAddToExistingAgreement: handleAddToExistingAgreement,
        onAddToNewAgreement: handleAddToNewAgreement,
        onClose: handleClose,
        onRemoveBasketItem: removeFromBasket,
      }}
    />
  );
};

BasketRoute.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    basket: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }),
  resources: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
    openAgreements: PropTypes.object,
  }),
};

export default BasketRoute;
