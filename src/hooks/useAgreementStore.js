// useAgreementStore.js
import { create } from 'zustand';
import { useLocalPageStore } from '@folio/stripes-erm-components';

const useAgreementStore = create((set, get) => ({
  currentAgreementId: null,
  checkAndSetAgreementId: (newId) => {
    const { currentAgreementId, resetLocalPageStore } = get();
    if (currentAgreementId !== newId) {
      resetLocalPageStore();
      set({ currentAgreementId: newId });
    }
  },
  resetLocalPageStore: () => {
    useLocalPageStore.getState().resetPageStore();
  }
}));

export default useAgreementStore;
