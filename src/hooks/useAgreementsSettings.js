import { useModConfigEntries } from '@k-int/stripes-kint-components';

const useAgreementsSettings = ({ queryParams, namespaceAppend } = {}) => {
  /*
   * This is important because useAgreementsSettings is
   * rendered (via useEresourcesEnabled) on the main App component.
   * This means that in settings (Which is rendered inside App itself, stripes behaviour)
   * the same query namespace would apply to the query in the config form, and also to
   * the App level hook call, resulting in an infinite loop.
   *
   * We avoid this by ensuring all calls using *this* hook have (at least) an extra namespace key item
   */
  const namespace = ['useAgreementsSettings'];
  if (Array.isArray(namespaceAppend)) {
    namespaceAppend.forEach(appendItem => {
      namespace.push(appendItem);
    });
  } else if (namespaceAppend) {
    namespace.push(namespaceAppend);
  }

  return useModConfigEntries({
    configName: 'general',
    moduleName: 'AGREEMENTS',
    namespaceAppend: namespace,
    queryParams
  });
};

export default useAgreementsSettings;
