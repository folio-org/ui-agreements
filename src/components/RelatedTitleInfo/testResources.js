const relatedSerialTitle = {
  id: 'e3710a12-0f8e-4e65-adeb-371ba03f1bd4',
  subType: {
    id: '02d318287be424d6017be432dd80000b',
    value: 'print',
    label: 'Print'
  },
  publicationType: {
    id: '02d318287be424d6017be432e5eb0043',
    value: 'journal',
    label: 'Journal'
  },
  identifiers: [{
    title: {
      id: 'e3710a12-0f8e-4e65-adeb-371ba03f1bd4'
    },
    status: {
      id: '02d318287be424d6017be432e64b0045',
      value: 'approved',
      label: 'approved'
    },
    identifier: {
      value: '0148-2076',
      ns: {
        value: 'issn'
      }
    }
  }],
  name: '19th century music',
  type: {
    id: '02d318287be424d6017be432dd9d000f',
    value: 'serial',
    label: 'Serial'
  },
  longName: '19th century music'
};

const relatedMonographTitle = {
  id: '7900934c-4059-49e6-a148-8b1270d89b42',
  subType: {
    id: '02d318287be424d6017be432dd8a000c',
    value: 'electronic',
    label: 'Electronic'
  },
  publicationType: {
    id: '02d318287be424d6017be4333d1e0046',
    value: 'book',
    label: 'Book'
  },
  identifiers: [{
    title: {
      id: '7900934c-4059-49e6-a148-8b1270d89b42'
    },
    status: {
      id: '02d318287be424d6017be432e64b0045',
      value: 'approved',
      label: 'approved'
    },
    identifier: {
      value: '978-3-319-60605-7',
      ns: {
        value: 'isbn'
      }
    }
  }, {
    title: {
      id: '7900934c-4059-49e6-a148-8b1270d89b42'
    },
    status: {
      id: '02d318287be424d6017be432e64b0045',
      value: 'approved',
      label: 'approved'
    },
    identifier: {
      value: '10.1007/978-3-319-60606-4',
      ns: {
        value: 'doi'
      }
    }
  }],
  name: '200 Years of Ricardian Trade Theory',
  type: {
    id: '02d318287be424d6017be432dd94000e',
    value: 'monograph',
    label: 'Monograph'
  },
  longName: '200 Years of Ricardian Trade Theory'
};

export { relatedMonographTitle, relatedSerialTitle };
