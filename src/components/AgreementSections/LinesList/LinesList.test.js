
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { MultiColumnList, MultiColumnListCell, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import LinesList from './LinesList';
import agreement from './testResources';

const onViewAgreementLine = jest.fn();
const visibleColumns = [
  'name',
  'provider',
  'publicationType',
  'count',
  'note',
  'coverage',
  'isCustomCoverage',
  'activeFrom',
  'activeTo',
  'poLines',
];

describe('LinesList', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <LinesList
          agreement={agreement}
          onViewAgreementLine={onViewAgreementLine}
          visibleColumns={visibleColumns}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Lines list MCL', async () => {
    await MultiColumnList('agreement-lines').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 10 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name / Description', 'Provider', 'Publication type', 'Count', 'Note', 'Coverage', ' ', 'Active from', 'Active to', 'PO Line'] }).exists();
  });

  test('renders expected row count', async () => {
    await MultiColumnList({ rowCount: agreement.agreementLinesCount }).exists();
  });

  test('renders expected agreement line name in each row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'ACS in Focus Test' }),
      await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'American Society of Civil Engineers : Journals' }),
      await MultiColumnListCell({ row: 2, columnIndex: 0 }).has({ content: '22-1887786-11234147a' }),
      await MultiColumnListCell({ row: 3, columnIndex: 0 }).has({ content: '14th century English mystics newsletter' }),
      await MultiColumnListCell({ row: 4, columnIndex: 0 }).has({ content: 'bc634143-36ed-4ae2-a991-5e35ae4fee6a:e2a8df5b-4d2c-4f65-82f4-fbd96f43538c' })

    ]);
  });

  test('renders expected Provider in each row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'American Chemical Society' }),
      await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: 'American Society of Civil Engineers' })
    ]);
  });

  test('renders expected Publication type date in each row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: 'Package' }),
      await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: 'Package' }),
      await MultiColumnListCell({ row: 2, columnIndex: 2 }).has({ content: 'Title' }),
      await MultiColumnListCell({ row: 3, columnIndex: 2 }).has({ content: 'Title' }),
      await MultiColumnListCell({ row: 4, columnIndex: 2 }).has({ content: 'Title' })
    ]);
  });

  describe('Clicking the first row', () => {
    beforeEach(async () => {
      /* clicking the second column here instead of the first one because the first cell has a
       link and we prevent the onRowClick to be called when we click a link within a cell */
      await MultiColumnList('agreement-lines').click({ row: 0, columnIndex: 1 });
    });

    test('should call the onViewAgreementLine callback', async () => {
      await waitFor(async () => {
        expect(onViewAgreementLine).toHaveBeenCalled();
      });
    });
  });
});

