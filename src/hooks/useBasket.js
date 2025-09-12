import useBasketStore from './useBasketStore';

const useBasket = () => {
  const basketStore = useBasketStore(state => state.basketStore);
  const addToBasket = useBasketStore(state => state.addToBasket);
  const existsInBasket = useBasketStore(state => state.existsInBasket);
  const removeFromBasket = useBasketStore(state => state.removeFromBasket);

  return {
    basket: Object.values(basketStore),
    basketStore,
    addToBasket,
    existsInBasket,
    removeFromBasket
  };
};

export default useBasket;
