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
      const identifiers = eresource.identifiers;

      sortedByTypeAsc = orderBy(identifiers, [typeLabel], ['asc']);
      sortedByTypeDesc = orderBy(identifiers, [typeLabel], ['desc']);

      sortedByIdentifierAsc = orderBy(identifiers, [i => i.identifier.value], ['asc']);
      sortedByIdentifierDesc = orderBy(identifiers, [i => i.identifier.value], ['desc']);
    });

    test('initial sort is ascending by type (all rows)', async () => {
      for (let row = 0; row < sortedByTypeAsc.length; row++) {
        // eslint-disable-next-line no-await-in-loop
        await MultiColumnListCell({ row, columnIndex: 0 }).has({
          content: typeLabel(sortedByTypeAsc[row])
        });
      }
    });

    describe('clicking Resource identifier type header', () => {
      beforeEach(async () => {
        await MultiColumnList('identifiers-list').clickHeader('Resource identifier type');
      });

      test('sort toggles to descending by type (all rows)', async () => {
        for (let row = 0; row < sortedByTypeDesc.length; row++) {
          // eslint-disable-next-line no-await-in-loop
          await MultiColumnListCell({ row, columnIndex: 0 }).has({
            content: typeLabel(sortedByTypeDesc[row])
          });
        }
      });

      describe('clicking Resource identifier type header again', () => {
        beforeEach(async () => {
          await MultiColumnList('identifiers-list').clickHeader('Resource identifier type');
        });

        test('sort toggles back to ascending by type (all rows)', async () => {
          for (let row = 0; row < sortedByTypeAsc.length; row++) {
            // eslint-disable-next-line no-await-in-loop
            await MultiColumnListCell({ row, columnIndex: 0 }).has({
              content: typeLabel(sortedByTypeAsc[row])
            });
          }
        });
      });
    });

    describe('clicking Resource identifier header', () => {
      beforeEach(async () => {
        await MultiColumnList('identifiers-list').clickHeader('Resource identifier');
      });

      test('sort is ascending by identifier (all rows)', async () => {
        for (let row = 0; row < sortedByIdentifierAsc.length; row++) {
          // eslint-disable-next-line no-await-in-loop
          await MultiColumnListCell({ row, columnIndex: 1 }).has({
            content: sortedByIdentifierAsc[row].identifier.value
          });
        }
      });

      describe('clicking Resource identifier header again', () => {
        beforeEach(async () => {
          await MultiColumnList('identifiers-list').clickHeader('Resource identifier');
        });

        test('sort toggles to descending by identifier (all rows)', async () => {
          for (let row = 0; row < sortedByIdentifierDesc.length; row++) {
            // eslint-disable-next-line no-await-in-loop
            await MultiColumnListCell({ row, columnIndex: 1 }).has({
              content: sortedByIdentifierDesc[row].identifier.value
            });
          }
        });
      });
    });
  });
});
