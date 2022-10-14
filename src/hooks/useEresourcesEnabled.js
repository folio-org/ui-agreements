import useAgreementsSettings from './useAgreementsSettings';

const useEresourcesEnabled = () => {
  const settings = useAgreementsSettings();
  return !settings?.parsedSettings?.hideEResourcesFunctionality;
};

export default useEresourcesEnabled;
