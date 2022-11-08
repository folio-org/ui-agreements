import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, KeyValue } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import RelatedAgreements from './RelatedAgreements';

const agreement = {
  'id': 'e4f4c885-509c-416f-810d-c0c337dc05a5',
  'dateCreated': '2021-08-03T19:12:33Z',
  'name': 'AM ag 2',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [
    {
      'id': '3007f712-d01d-489c-9afa-28f459e34240',
      'type': {
        'id': '2c9180bf7b0a10d8017b0a1163ff0013',
        'value': 'supersedes',
        'label': 'Supersedes'
      },
      'outward': {
        'id': 'e4f4c885-509c-416f-810d-c0c337dc05a5',
        'name': 'AM ag 2',
        'agreementStatus': {
          'id': '2c9180bf7b0a10d8017b0a1164ab0036',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-27',
        'endDate': null
      },
      'inward': {
        'id': '5644b8c6-561b-4f6b-95bd-b3f044918b8a',
        'name': 'AM ag 1',
        'agreementStatus': {
          'id': '2c9180bf7b0a10d8017b0a1164ab0036',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-04',
        'endDate': null
      }
    }
  ],
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-08-03T19:12:33Z',
  'inwardRelationships': [],
  'startDate': '2021-08-27',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': 'd4a2ef19-728c-4012-9135-11ce39f28fce',
      'startDate': '2021-08-27',
      'owner': {
        'id': 'e4f4c885-509c-416f-810d-c0c337dc05a5'
      },
      'periodStatus': 'next'
    }
  ],
  'usageDataProviders': [],
  'agreementStatus': {
    'id': '2c9180bf7b0a10d8017b0a1164ab0036',
    'value': 'active',
    'label': 'Active'
  },
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'alternateNames': [],
  'relatedAgreements': [
    {
      'id': '3007f712-d01d-489c-9afa-28f459e34240',
      'type': 'supersedes',
      'note': 'test note',
      'agreement': {
        'id': '5644b8c6-561b-4f6b-95bd-b3f044918b8a',
        'name': 'AM ag 1',
        'agreementStatus': {
          'id': '2c9180bf7b0a10d8017b0a1164ab0036',
          'value': 'active',
          'label': 'Active'
        },
        'startDate': '2021-08-04',
        'endDate': null
      }
    }
  ],
  'lines': [],
  'agreementLinesCount': 0,
  'eresources': [],
  'eresourcesCount': 0,
  'orderLines': []
};

let renderComponent;

describe('Related Agreements', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <RelatedAgreements
          agreement={agreement}
          id="relatedAgreements"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Related agreements Accordion', async () => {
    await Accordion('Related agreements').exists();
  });

  test('renders the related agreement card component', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('relatedAgreements')).toBeInTheDocument();
  });

  test('renders a link with the agreement name in the card header', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: 'AM ag 1' })).toBeInTheDocument();
  });

  test('renders the expected relationship value', async () => {
    await KeyValue('Relationship').has({ value: 'Supersedes "AM ag 2"' });
  });

  test('renders the expected note value', async () => {
    await KeyValue('Note').has({ value: 'test note' });
  });
});
