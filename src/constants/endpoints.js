export const REFDATA_ENDPOINT = 'erm/refdata';
export const CUSTPROP_ENDPOINT = 'erm/custprops';
export const SETTINGS_ENDPOINT = 'erm/settings/appSettings';
export const LICENSE_CUSTPROP_ENDPOINT = 'licenses/custprops';

export const AGREEMENTS_ENDPOINT = 'erm/sas';
export const AGREEMENT_ENDPOINT = (agreementId) => `${AGREEMENTS_ENDPOINT}/${agreementId}`;

export const AGREEMENT_ERESOURCES_ENDPOINT = (agreementId, filterPath) => `${AGREEMENT_ENDPOINT(agreementId)}/resources/${filterPath}`;

export const AGREEMENT_LINES_ENDPOINT = 'erm/entitlements';
export const AGREEMENT_LINES_EXTERNAL_ENDPOINT = 'erm/entitlements/external';
export const AGREEMENT_LINE_ENDPOINT = (lineId) => `${AGREEMENT_LINES_ENDPOINT}/${lineId}`;

export const ERESOURCES_ENDPOINT = 'erm/resource';
export const ERESOURCES_ELECTRONIC_ENDPOINT = `${ERESOURCES_ENDPOINT}/electronic`;
export const ERESOURCE_ENDPOINT = (eresourceId) => `${ERESOURCES_ENDPOINT}/${eresourceId}`;

export const ERESOURCE_ENTITLEMENTS_ENDPOINT = (eresourceId) => `${ERESOURCE_ENDPOINT(eresourceId)}/entitlements`;
export const ERESOURCE_RELATED_ENTITLEMENTS_ENDPOINT = (eresourceId) => `${ERESOURCE_ENDPOINT(eresourceId)}/entitlements/related`;
export const ERESOURCE_ENTITLEMENT_OPTIONS_ENDPOINT = (eresourceId) => `${ERESOURCE_ENDPOINT(eresourceId)}/entitlementOptions`;

export const PCIS_ENDPOINT = 'erm/pci';
export const PCI_ENDPOINT = (pciId) => `erm/pci/${pciId}`;
export const TITLES_ENDPOINT = 'erm/titles';
export const TITLES_ELECTRONIC_ENDPOINT = `${TITLES_ENDPOINT}/electronic`;
export const TITLE_ENDPOINT = (tiId) => `erm/titles/${tiId}`;

export const PACKAGES_ENDPOINT = 'erm/packages';
export const PACKAGE_ENDPOINT = (packageId) => `${PACKAGES_ENDPOINT}/${packageId}`;

export const PLATFORMS_ENDPOINT = 'erm/platforms';
export const PLATFORM_ENDPOINT = (platformId) => `${PLATFORMS_ENDPOINT}/${platformId}`;

export const MOD_SETTINGS_ENDPOINT = 'configurations/entries';

export const ORDER_LINES_ENDPOINT = 'orders/order-lines';
