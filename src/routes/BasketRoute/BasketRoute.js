import PropTypes from 'prop-types';

import {
  useParallelBatchFetch,
} from '@folio/stripes-erm-components';

import { useBasket } from '../../hooks';
import { AGREEMENTS_ENDPOINT } from '../../constants';

import View from '../../components/views/Basket';

const BasketRoute = ({ history }) => {
  const { basket, removeFromBasket } = useBasket();

  // AGREEMENTS BATCHED FETCH
  const { itemQueries } = useParallelBatchFetch({
    batchParams: {
      filters: [
        {
          path: 'agreementStatus.value',
          values: ['active', 'draft', 'in_negotiation', 'requested'],
        },
      ],
      sort: [{ path: 'name' }],
    },
    generateQueryKey: ({ offset }) => ['ERM', 'Agreements', AGREEMENTS_ENDPOINT, offset, 'BasketRoute'],
    endpoint: AGREEMENTS_ENDPOINT,
  });

  // Get items as they come through
  const openAgreements = itemQueries?.filter(q => !q.isFetching)?.reduce((acc, curr) => {
    return [...acc, ...(curr?.data?.results ?? [])];
  }, []);


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
