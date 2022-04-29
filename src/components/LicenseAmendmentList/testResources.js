const currentAmendments = {
  amendments: [
    {
      id: 'a931b294-9794-4416-820e-054b78510efa',
      name: 'Current amendment 1',
      note: 'current amendment note 1',
      status: {
        label: 'Active',
        value: 'active',
      },
      statusForThisAgreement: {
        value: 'current',
      },
      startDate: '2021-09-01',
    },
    {
      id: 'c2ad4cc4-69af-41b8-bba4-a541989f6e11',
      name: 'Current amendment 2',
      note: 'current amendment note 2',
      status: {
        label: 'Expired',
        value: 'expired',
      },
      statusForThisAgreement: {
        value: 'current',
      },
      startDate: '2021-09-01',
      endDate: '2099-09-30',
    },
    {
      id: 'd4c28655-e3f9-424c-b340-244d40dc4fa0',
      name: 'Current amendment 3',
      note: 'current amendment note 3',
      status: {
        label: 'Active',
        value: 'active',
      },
      statusForThisAgreement: {
        value: 'current',
      },
      startDate: '2021-01-01',
      endDate: '2021-09-15',
    },
    {
      id: '42646aca-f519-4de3-b13a-f9b40713fc6f',
      name: 'Current amendment 4',
      note: 'current amendment note 4',
      status: {
        label: 'Active',
        value: 'active',
      },
      statusForThisAgreement: {
        value: 'current',
      },
      startDate: '2099-01-01',
    },
    {
      id: '85f4d4f2-af10-43a4-9884-fae558af6abc',
      name: 'Current amendment 5',
      note: 'current amendment note 5',
      status: {
        label: 'Rejected',
        value: 'rejected',
      },
      statusForThisAgreement: {
        value: 'current',
      },
      startDate: '2021-09-01',
    },
  ],
  id: 'controlling-license-current-amendments',
  license: {
    id: '24c03685-d932-427c-a244-9ca0614f6df2',
  },
  renderNotes: true,
  renderStatuses: true,
  renderWarnings: true,
};
const futureAmendments = {
  amendments: [
    {
      id: 'e66e9da4-7b6d-4326-a611-4d8e4f623de9',
      name: 'Future amendment 1',
      note: 'future amendment note 1',
      status: {
        label: 'Not yet active',
      },
      statusForThisAgreement: {
        value: 'future'
      },
      startDate: '2030-10-01',
    },
    {
      id: 'eccae425-b08b-4f31-841c-1eb9cd3516a5',
      name: 'Future amendment 2',
      note: 'future amendment note 2',
      status: {
        label: 'Not yet active',
      },
      statusForThisAgreement: {
        value: 'future'
      },
      startDate: '2031-10-01',
    }
  ],
  id: 'controlling-license-future-amendments',
  license: {
    id: '24c03685-d932-427c-a244-9ca0614f6df2',
  },
  renderNotes: true,
  renderStatuses: true,
  renderWarnings: false,
};
const historicalAmendments = {
  amendments: [
    {
      id: '2028a550-f82a-43f2-8671-de620242d714',
      name: 'Historical amendment 1',
      note: 'historical amendment note 1',
      status: {
        label: 'Expired',
      },
      statusForThisAgreement: {
        value: 'historical'
      },
      startDate: '2021-08-01',
      endDate: '2021-09-01',
    },
    {
      id: 'fddc67a7-b25d-4cb2-a9f3-4e69f08cd723',
      name: 'Historical amendment 2',
      note: 'historical amendment note 2',
      status: {
        label: 'Expired',
      },
      statusForThisAgreement: {
        value: 'historical'
      },
      startDate: '2020-08-01',
      endDate: '2021-08-01',
    }
  ],
  id: 'controlling-license-historical-amendments',
  license: {
    id: '24c03685-d932-427c-a244-9ca0614f6df2',
  },
  renderNotes: true,
  renderStatuses: false,
  renderWarnings: false,
};

export { currentAmendments, futureAmendments, historicalAmendments };
