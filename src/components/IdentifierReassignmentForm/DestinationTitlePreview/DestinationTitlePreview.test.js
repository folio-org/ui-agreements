import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button, KeyValue, renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { StaticRouter as Router } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import DestinationTitlePreview from './DestinationTitlePreview';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormContext: () => ({
    handleSubmit: () => jest.fn(),
    getValues: () => jest.fn(),
  }),
}));

const onSubmitMock = jest.fn();
const previewModal = false;

const initialValues = {
  sourceTIObject: {
    id: '9d6d123c-94eb-49e0-a5ab-58009a8f6d85',
    subType: {
      id: '2c91809c80aba37f0180abaa27960010',
      value: 'electronic',
      label: 'Electronic'
    },
    dateCreated: '2022-05-10T02:16:21Z',
    tags: [],
    lastUpdated: '2022-05-10T02:16:21Z',
    normalizedName: '19th century music',
    publicationType: {
      id: '2c91809c80aba37f0180abaa31970069',
      value: 'journal',
      label: 'Journal'
    },
    coverage: [{
      id: 'e743e14f-ee88-4893-9c5f-378d54050f11',
      startDate: '1977-01-01',
      summary: 'v*/i*/1977-01-01 - v*/i*/*'
    }],
    alternateResourceNames: [],
    name: '19th century music',
    type: {
      id: '2c91809c80aba37f0180abaa27a30013',
      value: 'serial',
      label: 'Serial'
    },
    suppressFromDiscovery: false,
    work: {
      id: '480676d7-b090-4ca9-a25f-08ec2fd41935'
    },
    platformInstances: [{
      id: '68143288-3244-425a-a274-010c493f0939'
    }],
    class: 'org.olf.kb.TitleInstance',
    longName: '19th century music',
    identifiers: [{
      dateCreated: '2022-05-10T02:16:21Z',
      lastUpdated: '2022-05-10T02:16:21Z',
      status: {
        id: '2c91809c80aba37f0180abaa31f3006b',
        value: 'approved',
        label: 'approved'
      },
      identifier: {
        value: '38504',
        ns: {
          value: 'ezb'
        }
      }
    },
    {
      dateCreated: '2022-05-10T02:16:21Z',
      lastUpdated: '2022-05-10T02:16:21Z',
      status: {
        id: '2c91809c80aba37f0180abaa31f3006b',
        value: 'approved',
        label: 'approved'
      },
      identifier: {
        value: '2052442-0',
        ns: {
          value: 'zdb'
        }
      }
    }
    ],
    relatedTitles: [{
      id: '982d06ee-6add-4d74-9c44-7593a7b73d05',
      subType: {
        id: '2c91809c80aba37f0180abaa2791000f',
        value: 'print',
        label: 'Print'
      },
      publicationType: {
        id: '2c91809c80aba37f0180abaa31970069',
        value: 'journal',
        label: 'Journal'
      },
      name: '19th century music',
      type: {
        id: '2c91809c80aba37f0180abaa27a30013',
        value: 'serial',
        label: 'Serial'
      },
      longName: '19th century music',
      identifiers: [{
        dateCreated: '2022-05-10T02:16:21Z',
        lastUpdated: '2022-05-10T02:16:21Z',
        status: {
          id: '2c91809c80aba37f0180abaa31f3006b',
          value: 'approved',
          label: 'approved'
        },
        identifier: {
          value: '0148-2076',
          ns: {
            value: 'issn'
          }
        }
      }]
    }]
  },
  destinationTIObject: {
    id: '479fb104-ad73-4959-bf39-1a1ee2716ccd',
    subType: {
      id: '2c91809c80aba37f0180abaa27960010',
      value: 'electronic',
      label: 'Electronic'
    },
    dateCreated: '2022-05-10T02:17:36Z',
    tags: [],
    lastUpdated: '2022-05-10T02:17:36Z',
    normalizedName: '14th century english mystics newsletter',
    publicationType: {
      id: '2c91809c80aba37f0180abaa31970069',
      value: 'journal',
      label: 'Journal'
    },
    coverage: [{
      id: '3b9db365-cea7-4392-b779-1d6e6128f597',
      startDate: '1974-01-01',
      endDate: '1983-12-31',
      summary: 'v*/i*/1974-01-01 - v*/i*/1983-12-31'
    }],
    alternateResourceNames: [],
    name: '14th century English mystics newsletter',
    type: {
      id: '2c91809c80aba37f0180abaa27a30013',
      value: 'serial',
      label: 'Serial'
    },
    suppressFromDiscovery: false,
    work: {
      id: 'a68b8af3-f067-4b7a-b71a-2c28be38892e'
    },
    platformInstances: [{
      id: '3f550ab8-4ce5-4bd7-b491-e08b6eef40c0'
    }],
    class: 'org.olf.kb.TitleInstance',
    longName: '14th century English mystics newsletter',
    identifiers: [],
    relatedTitles: [{
      id: '49e8410d-39e0-4776-a14b-4cdfe6f2a598',
      subType: {
        id: '2c91809c80aba37f0180abaa2791000f',
        value: 'print',
        label: 'Print'
      },
      publicationType: {
        id: '2c91809c80aba37f0180abaa31970069',
        value: 'journal',
        label: 'Journal'
      },
      name: '14th century English mystics newsletter',
      type: {
        id: '2c91809c80aba37f0180abaa27a30013',
        value: 'serial',
        label: 'Serial'
      },
      longName: '14th century English mystics newsletter',
      identifiers: [{
        dateCreated: '2022-05-10T02:17:36Z',
        lastUpdated: '2022-05-10T02:17:36Z',
        status: {
          id: '2c91809c80aba37f0180abaa31f3006b',
          value: 'approved',
          label: 'approved'
        },
        identifier: {
          value: '0737-5840',
          ns: {
            value: 'issn'
          }
        }
      }]
    }]
  },
  destinationTitle: '479fb104-ad73-4959-bf39-1a1ee2716ccd',
  '9d6d123c-94eb-49e0-a5ab-58009a8f6d85': {
    ezb: [
      '38504'
    ]
  }
};

describe('DestinationTitlePreview', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <TestForm initialValues={initialValues} onSubmit={onSubmitMock}>
          <DestinationTitlePreview
            data={{}}
            previewModal={previewModal}
          />
        </TestForm>,
      </Router>,
      translationsProperties
    );
  });

  it('renders the DestinationTitlePreview card', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('destination-title-identifier-preview')).toBeInTheDocument();
  });

  test('renders expected heading', () => {
    const { getByText } = renderComponent;
    expect(getByText('Identifier destination')).toBeInTheDocument();
  });

  it('renders keyValue Material type', async () => {
    await KeyValue('Material type').exists();
  });

  test('renders the expected new identifier', async () => {
    await KeyValue('ezb').has({ value: '38504New' });
  });

  test('renders the expected issn value', async () => {
    await KeyValue('issn').has({ value: '0737-5840' });
  });

  test('renders the submit button', async () => {
    await Button('Submit').exists();
  });

  test('clicking the submit button ', async () => {
    await waitFor(async () => {
      await Button('Submit').click();
    });

    await waitFor(async () => {
      expect(onSubmitMock.mock.calls.length).toBe(1);
    });
  });

  test('renders a link with the title name', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: '14th century English mystics newsletter' })).toBeInTheDocument();
  });
});

