const urls = {
  agreements: () => '/erm/agreements',
  agreementView: id => `/erm/agreements/${id}`,
  agreementEdit: id => `/erm/agreements/${id}/edit`,
  agreementCreate: () => '/erm/agreements/create',

  amendmentView: (licenseId, amendmentId) => `/licenses/${licenseId}/amendments/${amendmentId}`,

  basket: () => '/erm/basket',

  eholdingsPackageView: id => `/eholdings/packages/${id}`,
  eholdingsResourceView: id => `/eholdings/resources/${id}`,

  eresources: () => '/erm/eresources',
  eresourceView: id => `/erm/eresources/${id}`,

  notes: () => '/erm/notes',
  noteView: id => `/erm/notes/${id}`,
  noteEdit: id => `/erm/notes/${id}/edit`,
  noteCreate: () => '/erm/notes/create',

  orgView: id => `/organizations/view/${id}`,

  poLineView: id => `/orders/lines/view/${id}`,

  udpView: id => `/eusage/view/${id}`
};

export default urls;
