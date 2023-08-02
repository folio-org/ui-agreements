
import { mockErmComponents, renderWithIntl, MultiColumnList, MultiColumnListCell } from '@folio/stripes-erm-testing';

import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import LicenseAmendmentList from './LicenseAmendmentList';
import { currentAmendments, futureAmendments, historicalAmendments } from './testResources';

/* EXAMPLE -- Overriding a particular jest mock */
/* For this test we would like to retain the actual stripes-erm-components version of LicenseEndDate */

/* First undo the manual mock in question */
jest.unmock('@folio/stripes-erm-components');
/* Then we can grab all the mocks except the one we don't want in use */
const { LicenseEndDate: _mockLicenseEndDate, ...mockedERMComps } = mockErmComponents;

/* Finally remock the module for this test */
jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockedERMComps
}));

describe('LicenseAmendmentList', () => {
  describe('List of current amendments', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <LicenseAmendmentList
            {...currentAmendments}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the MCL', async () => {
      await MultiColumnList(currentAmendments.id).exists();
    });

    test('renders expected column count', async () => {
      await MultiColumnList({ columnCount: 6 }).exists();
    });

    test('renders expected columns', async () => {
      await MultiColumnList({ columns: ['', 'Amendment', 'Status', 'Start date', 'End date', 'Note'] }).exists();
    });

    test('renders expected row count', async () => {
      await MultiColumnList({ rowCount: currentAmendments.amendments.length }).exists();
    });

    test('renders expected warning in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: '' }),
        await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'Conflicting statuses: Amendment status is "Expired" while "Status (this agreement)" is "Current."' }),
        await MultiColumnListCell({ row: 2, columnIndex: 0 }).has({ content: 'Amendment has ended while "Status (this agreement)" is "Current."' }),
        await MultiColumnListCell({ row: 3, columnIndex: 0 }).has({ content: 'Amendment starts in the future while "Status (this agreement)" is "Current."' }),
        await MultiColumnListCell({ row: 4, columnIndex: 0 }).has({ content: 'Conflicting statuses: Amendment status is "Rejected" while "Status (this agreement)" is "Current."' })
      ]);
    });

    test('renders expected name in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: currentAmendments.amendments[0].name }),
        await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: currentAmendments.amendments[1].name }),
        await MultiColumnListCell({ row: 2, columnIndex: 1 }).has({ content: currentAmendments.amendments[2].name }),
        await MultiColumnListCell({ row: 3, columnIndex: 1 }).has({ content: currentAmendments.amendments[3].name }),
        await MultiColumnListCell({ row: 4, columnIndex: 1 }).has({ content: currentAmendments.amendments[4].name })
      ]);
    });

    test('renders expected status in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: currentAmendments.amendments[0].status.label }),
        await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: currentAmendments.amendments[1].status.label }),
        await MultiColumnListCell({ row: 2, columnIndex: 2 }).has({ content: currentAmendments.amendments[2].status.label }),
        await MultiColumnListCell({ row: 3, columnIndex: 2 }).has({ content: currentAmendments.amendments[3].status.label }),
        await MultiColumnListCell({ row: 4, columnIndex: 2 }).has({ content: currentAmendments.amendments[4].status.label })
      ]);
    });

    test('renders expected startDate in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: '9/1/2021' }),
        await MultiColumnListCell({ row: 1, columnIndex: 3 }).has({ content: '9/1/2021' }),
        await MultiColumnListCell({ row: 2, columnIndex: 3 }).has({ content: '1/1/2021' }),
        await MultiColumnListCell({ row: 3, columnIndex: 3 }).has({ content: '1/1/2099' }),
        await MultiColumnListCell({ row: 4, columnIndex: 3 }).has({ content: '9/1/2021' })
      ]);
    });

    test('renders expected endDate in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 4 }).has({ content: '' }),
        await MultiColumnListCell({ row: 1, columnIndex: 4 }).has({ content: '9/30/2099' }),
        await MultiColumnListCell({ row: 2, columnIndex: 4 }).has({ content: '9/15/2021' }),
        await MultiColumnListCell({ row: 3, columnIndex: 4 }).has({ content: '' }),
        await MultiColumnListCell({ row: 4, columnIndex: 4 }).has({ content: '' }),
      ]);
    });

    test('renders expected note in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 5 }).has({ content: currentAmendments.amendments[0].note }),
        await MultiColumnListCell({ row: 1, columnIndex: 5 }).has({ content: currentAmendments.amendments[1].note }),
        await MultiColumnListCell({ row: 2, columnIndex: 5 }).has({ content: currentAmendments.amendments[2].note }),
        await MultiColumnListCell({ row: 3, columnIndex: 5 }).has({ content: currentAmendments.amendments[3].note }),
        await MultiColumnListCell({ row: 4, columnIndex: 5 }).has({ content: currentAmendments.amendments[4].note })
      ]);
    });
  });

  describe('List of future amendments', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <LicenseAmendmentList
            {...futureAmendments}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the MCL', async () => {
      await MultiColumnList(futureAmendments.id).exists();
    });

    test('renders expected column count', async () => {
      await MultiColumnList({ columnCount: 5 }).exists();
    });

    test('renders expected columns', async () => {
      await MultiColumnList({ columns: ['Amendment', 'Status', 'Start date', 'End date', 'Note'] }).exists();
    });

    test('renders expected row count', async () => {
      await MultiColumnList({ rowCount: futureAmendments.amendments.length }).exists();
    });

    test('renders expected name in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: futureAmendments.amendments[0].name }),
        await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: futureAmendments.amendments[1].name })
      ]);
    });

    test('renders expected status in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: futureAmendments.amendments[0].status.label }),
        await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: futureAmendments.amendments[1].status.label })
      ]);
    });

    test('renders expected startDate in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '10/1/2030' }),
        await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: '10/1/2031' })
      ]);
    });

    test('renders expected endDate in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: '' }),
        await MultiColumnListCell({ row: 1, columnIndex: 3 }).has({ content: '' })
      ]);
    });

    test('renders expected note in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 4 }).has({ content: futureAmendments.amendments[0].note }),
        await MultiColumnListCell({ row: 1, columnIndex: 4 }).has({ content: futureAmendments.amendments[1].note })
      ]);
    });
  });

  describe('List of historical amendments', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <LicenseAmendmentList
            {...historicalAmendments}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the MCL', async () => {
      await MultiColumnList(historicalAmendments.id).exists();
    });

    test('renders expected column count', async () => {
      await MultiColumnList({ columnCount: 4 }).exists();
    });

    test('renders expected columns', async () => {
      await MultiColumnList({ columns: ['Amendment', 'Start date', 'End date', 'Note'] }).exists();
    });

    test('renders expected row count', async () => {
      await MultiColumnList({ rowCount: historicalAmendments.amendments.length }).exists();
    });

    test('renders expected name in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: historicalAmendments.amendments[0].name }),
        await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: historicalAmendments.amendments[1].name })
      ]);
    });

    test('renders expected startDate in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: '8/1/2021' }),
        await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: '8/1/2020' })
      ]);
    });

    test('renders expected endDate in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '9/1/2021' }),
        await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: '8/1/2021' })
      ]);
    });

    test('renders expected note in each row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: historicalAmendments.amendments[0].note }),
        await MultiColumnListCell({ row: 1, columnIndex: 3 }).has({ content: historicalAmendments.amendments[1].note })
      ]);
    });
  });
});
