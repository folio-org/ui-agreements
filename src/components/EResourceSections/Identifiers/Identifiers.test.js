import orderBy from 'lodash/orderBy';

import {
  renderWithIntl,
  MultiColumnList,
  MultiColumnListCell,
  MultiColumnListHeader
} from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Identifiers from './Identifiers';

import { pkgs, tis } from '../../../../test/jest/eresources';

const pkg = pkgs.find(p => p.id === 'eab7a8ea-6665-4f06-a55a-73a5aad36215');
const title = tis.find(t => t.id === '38138ae2-9dd9-412a-a0eb-e8890c9d1274');

const cases = [
  {
    name: 'package',
    eresource: pkg,
    typeLabels: {
      gokb_id: 'GOKB ID',
      gokb_uuid: 'GOKB UUID',
    },
  },
  {
    name: 'title',
    eresource: title,
    typeLabels: {
      ezb: 'EZB',
      gokb_uuid: 'GOKB UUID',
      issn: 'ISSN',
      zdb: 'ZDB',
    },
  },
];

describe.each(cases)('Identifiers ($name)', ({ eresource, typeLabels }) => {
  const typeLabel = (item) => typeLabels[item.identifier.ns.value] || item.identifier.ns.value;

  const sortedByTypeAsc = orderBy(eresource.identifiers, [typeLabel], ['asc']);
  const sortedByTypeDesc = orderBy(eresource.identifiers, [typeLabel], ['desc']);
  const sortedByIdentifierAsc = orderBy(eresource.identifiers, [i => i.identifier.value], ['asc']);
  const sortedByIdentifierDesc = orderBy(eresource.identifiers, [i => i.identifier.value], ['desc']);

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
    test.each(
      sortedByTypeAsc.map((item, row) => ({
        row,
        content: typeLabel(item),
      }))
    )('initial sort is ascending by type - row $row', async ({ row, content }) => {
      await MultiColumnListCell({ row, columnIndex: 0 }).has({ content });
    });

    describe('clicking Resource identifier type header', () => {
      beforeEach(async () => {
        await MultiColumnList('identifiers-list').clickHeader('Resource identifier type');
      });

      test.each(
        sortedByTypeDesc.map((item, row) => ({
          row,
          content: typeLabel(item),
        }))
      )('sort toggles to descending by type - row $row', async ({ row, content }) => {
        await MultiColumnListCell({ row, columnIndex: 0 }).has({ content });
      });

      describe('clicking Resource identifier type header again', () => {
        beforeEach(async () => {
          await MultiColumnList('identifiers-list').clickHeader('Resource identifier type');
        });

        test.each(
          sortedByTypeAsc.map((item, row) => ({
            row,
            content: typeLabel(item),
          }))
        )('sort toggles back to ascending by type - row $row', async ({ row, content }) => {
          await MultiColumnListCell({ row, columnIndex: 0 }).has({ content });
        });
      });
    });

    describe('clicking Resource identifier header', () => {
      beforeEach(async () => {
        await MultiColumnList('identifiers-list').clickHeader('Resource identifier');
      });

      test.each(
        sortedByIdentifierAsc.map((item, row) => ({
          row,
          content: item.identifier.value,
        }))
      )('sort is ascending by identifier - row $row', async ({ row, content }) => {
        await MultiColumnListCell({ row, columnIndex: 1 }).has({ content });
      });

      describe('clicking Resource identifier header again', () => {
        beforeEach(async () => {
          await MultiColumnList('identifiers-list').clickHeader('Resource identifier');
        });

        test.each(
          sortedByIdentifierDesc.map((item, row) => ({
            row,
            content: item.identifier.value,
          }))
        )('sort toggles to descending by identifier - row $row', async ({ row, content }) => {
          await MultiColumnListCell({ row, columnIndex: 1 }).has({ content });
        });
      });
    });
  });
});
