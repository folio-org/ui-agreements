const DEFAULT_INITIAL_LOAD = 10;
const DEFAULT_PAGE_SIZE = 10;
const defaultSettingsValues = {
  initialLoad: {
    agreementLines: DEFAULT_INITIAL_LOAD,
    coveredEresources: DEFAULT_INITIAL_LOAD,
    acquisitionOptions: DEFAULT_INITIAL_LOAD,
    packageContents: DEFAULT_INITIAL_LOAD,
    entitlementAgreements: DEFAULT_INITIAL_LOAD
  },
  pageSize: {
    agreementLines: DEFAULT_PAGE_SIZE,
    coveredEresources: DEFAULT_PAGE_SIZE,
    acquisitionOptions: DEFAULT_PAGE_SIZE,
    packageContents: DEFAULT_PAGE_SIZE,
    entitlementAgreements: DEFAULT_PAGE_SIZE
  },
};

export default defaultSettingsValues;
