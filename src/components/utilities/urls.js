const urls = {
  agreements: () => '/erm/agreements',
  agreementView: id => `/erm/agreements/${id}`,
  agreementEdit: id => `/erm/agreements/${id}/edit`,
  agreementCreate: () => '/erm/agreements/create',

  agreementLines: () => '/erm/agreementLines',
  agreementLineNativeView: (aId, lId) => `/erm/agreementLines/${lId}/agreement/${aId}`,
  agreementLineNativeEdit: (aId, lId) => `/erm/agreementLines/${lId}/agreement/${aId}/edit`,
  agreementLineView: (aId, lId) => `/erm/agreements/${aId}/line/${lId}`,
  agreementLineCreate: aId => `/erm/agreements/${aId}/line/create`,
  agreementLineEdit: (aId, lId) => `/erm/agreements/${aId}/line/${lId}/edit`,

  amendmentView: (licenseId, amendmentId) => `/licenses/${licenseId}/amendments/${amendmentId}`,

  basket: () => '/erm/basket',

  eholdingsPackageView: id => `/eholdings/packages/${id}`,
  eholdingsResourceView: id => `/eholdings/resources/${id}`,

  packages: () => '/erm/packages',
  packageView: id => `/erm/packages/${id}`,

  licenseView: id => `/licenses/${id}`,

  notes: () => '/erm/notes',
  noteView: id => `/erm/notes/${id}`,
  noteEdit: id => `/erm/notes/${id}/edit`,
  noteCreate: () => '/erm/notes/create',

  platforms: () => '/erm/platforms',
  platformView: id => `/erm/platforms/${id}`,
  platformEdit: id => `/erm/platforms/${id}/edit`,

  orgView: id => `/organizations/view/${id}`,

  poLineView: id => `/orders/lines/view/${id}`,

  titles: () => '/erm/titles',
  titleView: id => `/erm/titles/${id}`,
  titleEdit: id => `/erm/titles/${id}/edit`,

  viewInstance: id => `/inventory/view/${id}`,

  udpView: id => `/eusage/view/${id}`,

  urlCustomizerView: (platformId, templateId) => `/erm/platforms/${platformId}/urlcustomizer/${templateId}`,
  urlCustomizerCreate: (platformId) => `/erm/platforms/${platformId}/urlcustomizer/create`,
  urlCustomizerEdit: (platformId, templateId) => `/erm/platforms/${platformId}/urlcustomizer/${templateId}/edit`

};

export default urls;
