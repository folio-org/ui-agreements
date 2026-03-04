import orderBy from 'lodash/orderBy';

import { renderWithIntl, MultiColumnList, MultiColumnListCell, MultiColumnListHeader } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Identifiers from './Identifiers';

import { pkgs } from '../../../../test/jest/eresources';

const eresource = pkgs.find(p => p.id === 'eab7a8ea-6665-4f06-a55a-73a5aad36215');

describe('Identifiers', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <Identifiers
          eresource={eresource}
          id="identifiers"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the identifiers MCL', async () => {
    await MultiColumnList('identifiers-list').exists();
  });

  test('should render an MCL with 2 columns', async () => {
    await MultiColumnList('identifiers-list').has({ columnCount: 2 });
  });

  const expectedColumns = ['Resource identifier type', 'Resource identifier'];

  test.each(expectedColumns)('%s column renders', async (colName) => {
    await MultiColumnListHeader(colName).exists();
  });

  describe('sorting', () => {
    let sortedByTypeAsc;
    let sortedByTypeDesc;
    let sortedByIdentifierAsc;
    let sortedByIdentifierDesc;

    beforeEach(() => {
      // We know what the type labels resolve to:
      // gokb_id   -> "GOKB ID"
      // gokb_uuid -> "GOKB UUID"
      const typeLabel = (item) => (
        item.identifier.ns.value === 'gokb_id' ? 'GOKB ID' : 'GOKB UUID'
      );

      sortedByTypeAsc = orderBy(eresource.identifiers, [typeLabel], ['asc']);
      sortedByTypeDesc = orderBy(eresource.identifiers, [typeLabel], ['desc']);

      sortedByIdentifierAsc = orderBy(eresource.identifiers, [i => i.identifier.value], ['asc']);
      sortedByIdentifierDesc = orderBy(eresource.identifiers, [i => i.identifier.value], ['desc']);
    });

    test('initial sort is ascending by type', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({
        content: (sortedByTypeAsc[0].identifier.ns.value === 'gokb_id' ? 'GOKB ID' : 'GOKB UUID')
      });
    });

    describe('clicking Resource identifier type header', () => {
      beforeEach(async () => {
        await MultiColumnList().clickHeader('Resource identifier type');
      });

      test('sort toggles to descending by type', async () => {
        await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({
          content: (sortedByTypeDesc[0].identifier.ns.value === 'gokb_id' ? 'GOKB ID' : 'GOKB UUID')
        });
      });

      describe('clicking Resource identifier type header again', () => {
        beforeEach(async () => {
          await MultiColumnList().clickHeader('Resource identifier type');
        });

        test('sort toggles back to ascending by type', async () => {
          await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({
            content: (sortedByTypeAsc[0].identifier.ns.value === 'gokb_id' ? 'GOKB ID' : 'GOKB UUID')
          });
        });
      });
    });

    describe('clicking Resource identifier header', () => {
      beforeEach(async () => {
        await MultiColumnList().clickHeader('Resource identifier');
      });

      test('sort is ascending by identifier', async () => {
        await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({
          content: sortedByIdentifierAsc[0].identifier.value
        });
      });

      describe('clicking Resource identifier header again', () => {
        beforeEach(async () => {
          await MultiColumnList().clickHeader('Resource identifier');
        });

        test('sort toggles to descending by identifier', async () => {
          await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({
            content: sortedByIdentifierDesc[0].identifier.value
          });
        });
      });
    });
  });
});
