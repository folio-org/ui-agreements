import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';

const useEresourcesEnabled = ({ queryParams } = {}) => {
  const settings = useAgreementsDisplaySettings({ queryParams });
  return !settings?.parsedSettings?.hideEResourcesFunctionality;
};

export default useEresourcesEnabled;
