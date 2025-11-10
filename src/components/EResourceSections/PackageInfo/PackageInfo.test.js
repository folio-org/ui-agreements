
import { MemoryRouter } from 'react-router-dom';
import { FormattedDateTime, renderWithIntl, KeyValue } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import PackageInfo from './PackageInfo';
import { pkgs as centralPkgs } from '../../../../test/jest/eresources';

jest.mock('../../AddToBasketButton', () => () => <div>Add package to basket</div>);

const pkgs = { eresource: centralPkgs[0] };
const packagesWithNoValues = { eresource: {} };

let renderComponent;

describe('PackageInfo', () => {
  describe('when data is passed', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PackageInfo
            data={pkgs}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the package name', () => {
      const { getByText } = renderComponent;
      expect(getByText(pkgs.eresource.name)).toBeInTheDocument();
    });

    test('renders the Add package to basket button', () => {
      const { getByText } = renderComponent;
      expect(getByText('Add package to basket')).toBeInTheDocument();
    });

    test('renders the Provider field', async () => {
      await KeyValue('Provider').exists();
    });

    test('renders the expcected provider', async () => {
      await KeyValue('Provider').has({ value: 'Emerald Group Publishing Limited' });
    });

    test('renders the Source field', async () => {
      await KeyValue('Source').exists();
    });

    test('renders the expcected source', async () => {
      await KeyValue('Source').has({ value: 'GOKb' });
    });

    test('renders the Status field', async () => {
      await KeyValue('Status').exists();
    });

    test('renders the expcected status', async () => {
      await KeyValue('Status').has({ value: 'Current' });
    });

    test('renders the Reference field', async () => {
      await KeyValue('Reference').exists();
    });

    test('renders the expcected reference', async () => {
      await KeyValue('Reference').has({ value: '01de7360-8475-401e-8388-5c5c9b1186c3' });
    });

    test('renders the Content type field', async () => {
      await KeyValue('Content type').exists();
    });

    test('renders the expcected content types', async () => {
      await KeyValue('Content type').has({ value: 'PrintElectronic' });
    });

    test('renders the Availability field', async () => {
      await KeyValue('Availability').exists();
    });

    test('renders the expcected availability', async () => {
      await KeyValue('Availability').has({ value: 'Global' });
    });

    test('renders the Source created field', async () => {
      await KeyValue('Source created').exists();
    });

    test('renders the expected source title count', async () => {
      await KeyValue('Source title count').exists();
    });

    test('renders the expcected Source title count', async () => {
      await KeyValue('Source title count').has({ value: '11' });
    });

    test('renders the expected source created date and time', async () => {
      await FormattedDateTime({ id: 'source-data-created-datetime' }).has({ date: '8/5/2021' });
      await FormattedDateTime({ id: 'source-data-created-datetime' }).has({ time: '11:51 AM' });
    });

    test('renders the Source last updated field', async () => {
      await KeyValue('Source last updated').exists();
    });

    test('renders the expected source updated date and time', async () => {
      await FormattedDateTime({ id: 'source-data-updated-datetime' }).has({ date: '9/21/2022' });
      await FormattedDateTime({ id: 'source-data-updated-datetime' }).has({ time: '2:09 PM' });
    });

    test('renders the Synchronisation status field', async () => {
      await KeyValue('Synchronisation status').exists();
    });

    test('renders the expcected Synchronisation status field', async () => {
      await KeyValue('Synchronisation status').has({ value:  'Enabled' });
    });
  });

  describe('when data with empty provider, source, status, reference, content type, availability, source dates is passed', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PackageInfo
            data={packagesWithNoValues}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the expcected provider', async () => {
      await KeyValue('Provider').has({ value: 'No value set-' });
    });

    test('renders the expcected source', async () => {
      await KeyValue('Source').has({ value: 'No value set-' });
    });

    test('renders the expcected status', async () => {
      await KeyValue('Status').has({ value: 'No value set-' });
    });

    test('renders the expcected reference', async () => {
      await KeyValue('Reference').has({ value: 'No value set-' });
    });

    test('renders the expcected content type', async () => {
      await KeyValue('Content type').has({ value: 'No value set-' });
    });

    test('renders the expcected availability', async () => {
      await KeyValue('Availability').has({ value: 'No value set-' });
    });

    test('renders the expcected source created date', async () => {
      await KeyValue('Source created').has({ value: 'No value set-' });
    });

    test('renders the expcected source last updated date', async () => {
      await KeyValue('Source last updated').has({ value: 'No value set-' });
    });

    test('renders the Synchronisation status field', async () => {
      await KeyValue('Synchronisation status').exists();
    });

    test('renders the expcected Synchronisation status field', async () => {
      await KeyValue('Synchronisation status').has({ value:  'No value set-' });
    });
  });
});
