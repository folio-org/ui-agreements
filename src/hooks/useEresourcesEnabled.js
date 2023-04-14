import useAgreementsSettings from './useAgreementsSettings';

const useEresourcesEnabled = ({ queryParams } = {}) => {
  const settings = useAgreementsSettings({ queryParams });
  return !settings?.parsedSettings?.hideEResourcesFunctionality;
};

export default useEresourcesEnabled;
