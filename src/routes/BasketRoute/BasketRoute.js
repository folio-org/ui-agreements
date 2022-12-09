import React from 'react';
import PropTypes from 'prop-types';

import { useBatchedFetch } from '@folio/stripes-erm-components';

import { useBasket } from '../../hooks';
import { AGREEMENTS_ENDPOINT } from '../../constants/endpoints';

import View from '../../components/views/Basket';
import { urls } from '../../components/utilities';

const BasketRoute = ({
  history,
}) => {
  const { basket, removeFromBasket } = useBasket();

  // AGREEMENTS BATCHED FETCH
  const {
    results: openAgreements,
  } = useBatchedFetch({
    batchParams:  {
      filters: [
        {
          path: 'agreementStatus.value',
          values: ['active', 'draft', 'in_negotiation', 'requested']
        }
      ],
      sort: [
        { path: 'name' },
      ],
    },
    nsArray: ['ERM', 'Agreements', AGREEMENTS_ENDPOINT, 'BasketRoute'],
    path: AGREEMENTS_ENDPOINT
  });

  const handleAddToExistingAgreement = (addFromBasket, agreementId) => {
    history.push(`${urls.agreementEdit(agreementId)}?addFromBasket=${addFromBasket}`);
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
