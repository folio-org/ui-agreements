import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import PackageIdentifiers from './PackageIdentifiers';

const pkg = {
  'id': '98a7b8fe-cd85-41b4-8eea-11eb80c0290f',
  'identifiers': [
    {
      'identifier': {
        'value': 'isil-1',
        'ns': {
          'value': 'isil'
        }
      },
    },
    {
      'identifier': {
        'value': 'zdb-1',
        'ns': {
          'value': 'zdb-pkg'
        }
      },
    },
    {
      'identifier': {
        'value': 'ezb-1',
        'ns': {
          'value': 'ezb-collection-id'
        }
      },
    },
    {
      'identifier': {
        'value': 'e-book-pool-1',
        'ns': {
          'value': 'ebp-id-pkg'
        }
      },
    },
    {
      'identifier': {
        'value': 'gokb-id-1',
        'ns': {
          'value': 'gokb_id'
        }
      },
    },
    {
      'identifier': {
        'value': 'gokb-uuid-1',
        'ns': {
          'value': 'gokb_uuid'
        }
      },
    }
  ]
};

let renderComponent;

describe('PackageInfo', () => {
  describe('when data is passed', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PackageIdentifiers
            pkg={pkg}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the expected isil value', async () => {
      await KeyValue('ISIL').has({ value: 'isil-1' });
    });

    test('renders the expected zdb value', async () => {
      await KeyValue('ZDB').has({ value: 'zdb-1' });
    });

    test('renders the expected ezb value', async () => {
      await KeyValue('EZB').has({ value: 'ezb-1' });
    });

    test('renders the expected e-book pool value', async () => {
      await KeyValue('E-Book Pool').has({ value: 'e-book-pool-1' });
    });

    test('renders the expected gokb id value', async () => {
      await KeyValue('GOKb ID').has({ value: 'gokb-id-1' });
    });

    test('renders the expected gokb uuid value', async () => {
      await KeyValue('GOKb UUID').has({ value: 'gokb-uuid-1' });
    });
  });
});
