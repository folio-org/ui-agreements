import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';

const useEresourcesEnabled = () => {
  const settings = useAgreementsDisplaySettings();
  return !settings?.parsedSettings?.hideEResourcesFunctionality;
};

export default useEresourcesEnabled;
