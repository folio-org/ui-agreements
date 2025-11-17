import { pcis } from './eresources';
import { agreements } from './agreements';

const externalEntitlements = [
  {
    id: '1c247260-bd39-4a5a-887f-25c40cfc53d2',
    type: 'external',
    description: 'This is description.',
    authority: 'EKB-TITLE',
    reference: '32498-16793-12384379',
    explanation: null,
    startDate: '2021-08-04',
    endDate: '2021-09-30',
    activeFrom: '2021-08-04',
    activeTo: '2021-08-28',
    contentUpdated: null,
    haveAccess: true,
    suppressFromDiscovery: true,
    note: 'This is note.',
    tags: '[]',
    owner: agreements.find(a => a.name === 'MR agr test'),
    customCoverage: false,
    coverage: [{
      startDate: '2015-01-01',
      endDate: '2015-12-31',
      summary: 'v*/i*/2015-01-01 - v*/i*/2015-12-31'
    }],
    reference_object: {
      label: '„Swoja i obca”',
      type: 'Book',
      provider: 'Wydawnictwo Naukowe PWN',
      publicationType: 'Book',
      url: 'https://libra.ibuk.pl/book/166729',
      identifiers: [{
        identifier: {
          value: '978-83-7996-171-9',
          ns: '{value: "pisbn"}'
        }
      }],
      authors: [
        'Agata Paliwoda'
      ],
      packageData: {
        authority: 'EKB-PACKAGE',
        reference: '32498-16793',
        name: 'IBUK Libra',
        titleCount: 39204,
        selectedCount: 0,
        contentType: 'Aggregated Full Text',
        providerName: 'Wydawnictwo Naukowe PWN'
      },
      providerName: 'Wydawnictwo Naukowe PWN'
    },
    poLines: '[]'
  },
  // external with error
  {
    id: 'ff352239-ee90-42cc-9596-ea11e4a4c70d',
    type: 'external',
    description: null,
    authority: 'EKB-TITLE',
    reference: '22-1887786-11234147a',
    explanation: null,
    startDate: null,
    endDate: null,
    activeFrom: null,
    activeTo: null,
    contentUpdated: null,
    haveAccess: true,
    suppressFromDiscovery: false,
    note: null,
    owner: agreements.find(a => a.name === 'MR agr test'),
    reference_object: {
      error: 400,
      message: 'Bad Request'
    }
  },
  {
    id: '857ab328-757b-4c2f-8fcc-e501c5cdacfb',
    type: 'external',
    authority: 'GOKB-RESOURCE',
    reference: '62a9c479-930e-4a60-a415-2ad62b4011ca:0f66bb0e-f6ae-4812-ad8e-cac2b0cc622d',
    owner: agreements.find(a => a.name === 'Minimal agreement'),
    poLines: [],
  }
];

const entitlements = [
  {
    id: '13672d4d-1c9e-4957-b4c8-975e48fd9365',
    dateCreated: '2021-09-06T10:19:23Z',
    activeTo: '2021-09-30',
    tags: '[]',
    lastUpdated: '2021-09-06T10:21:11Z',
    owner: agreements.find(a => a.name === 'MR agr packages'),
    resource: pcis.find(p => p.name === "'Institutions, industrial upgrading, and economic performance in Ja...' on Platform 'Elgaronline' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ..."),
    activeFrom: '2021-09-01',
    poLines: '[]',
    suppressFromDiscovery: true,
    note: 'This is note',
    description: 'This is agreement line description',
    customCoverage: false,
    explanation: 'Agreement includes this item from a package specifically',
    startDate: '2021-09-02',
    endDate: '2021-09-22',
    contentUpdated: null,
    haveAccess: true
  }
];

export {
  externalEntitlements,
  entitlements,
};
