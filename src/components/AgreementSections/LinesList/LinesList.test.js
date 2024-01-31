
import { renderWithIntl, MultiColumnList, MultiColumnListCell } from '@folio/stripes-erm-testing';
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
      await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'American Society of Civil Engineers : Journals' })
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
      await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: 'Package' })
    ]);
  });

  describe('Clicking the first row', () => {
    beforeEach(async () => {
      /* clicking the second column here instead of the first one because the first cell has a
       link and we prevent the onRowClick to be called when we click a link within a cell */
      await MultiColumnList('agreement-lines').click({ row: 0, columnIndex: 1 });
    });

    test('should call the onViewAgreementLine callback', () => {
      expect(onViewAgreementLine).toHaveBeenCalled();
    });
  });
});

