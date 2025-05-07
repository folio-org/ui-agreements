import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';

const useSuppressFromDiscovery = ({ queryParams } = {}) => {
  const { parsedSettings = {} } = useAgreementsDisplaySettings({ queryParams });

  return (resource) => {
    return parsedSettings.displaySuppressFromDiscovery?.[resource] ?? true;
  };
};

export default useSuppressFromDiscovery;
