import useAgreementsSettings from './useAgreementsSettings';

const useSuppressFromDiscovery = () => {
  const { parsedSettings = {} } = useAgreementsSettings();

  return (resource) => {
    return parsedSettings.displaySuppressFromDiscovery?.[resource] ?? true;
  };
};

export default useSuppressFromDiscovery;
