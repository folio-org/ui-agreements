import useBasketStore from './useBasketStore';

const useBasket = () => {
  const basketStore = useBasketStore(state => state.basketStore);
  const addToBasket = useBasketStore(state => state.addToBasket);
  const removeFromBasket = useBasketStore(state => state.removeFromBasket);

  return {
    basket: Object.values(basketStore),
    basketStore,
    addToBasket,
    removeFromBasket
  };
};

export default useBasket;
