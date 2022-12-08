import create from 'zustand';
// We can easily persist this in future, just by uncommenting the code below
/*
import { persist } from 'zustand/middleware';
*/

const useBasketStore = create(
  /* persist( */
  (set) => ({
    basketStore: {},
    addToBasket: (item) => set((state) => {
      if (state.basketStore[item.id] || !item.id) {
        return state;
      }

      return { ...state, basketStore: { ...state.basketStore, [item.id]: item } };
    }),
    removeFromBasket: (item) => set((state) => {
      if (!state.basketStore[item.id] || !item.id) {
        return state;
      }

      const { [item.id]: _itemToRemove, ...newBasket } = state.basketStore;
      return { ...state, basketStore: newBasket };
    }),
  })/* ,
    {
      name: '@folio/agreements:basket'
    }
  ) */
);

export default useBasketStore;
