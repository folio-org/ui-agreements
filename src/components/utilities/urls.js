const urls = {
  agreements: () => '/erm/agreements',
  agreementView: id => `/erm/agreements/${id}`,
  agreementEdit: id => `/erm/agreements/${id}/edit`,
  agreementCreate: () => '/erm/agreements/create',

  basket: () => '/erm/basket',

  eresources: () => '/erm/eresources',
  eresourceView: id => `/erm/eresources/${id}`,

  notes: () => '/erm/notes',
  noteView: id => `/erm/notes/${id}`,
  noteEdit: id => `/erm/notes/${id}/edit`,
  noteCreate: () => '/erm/notes/create',

  eholdingsPackageView: id => `/eholdings/packages/${id}`,
  eholdingsResourceView: id => `/eholdings/resources/${id}`,
};

export default urls;
