import useAgreementsSettings from './useAgreementsSettings';

const useSuppressFromDiscovery = ({ queryParams } = {}) => {
  const { parsedSettings = {} } = useAgreementsSettings({ queryParams });

  return (resource) => {
    return parsedSettings.displaySuppressFromDiscovery?.[resource] ?? true;
  };
};

export default useSuppressFromDiscovery;
