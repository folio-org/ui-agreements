import { MemoryRouter } from 'react-router-dom';

import {
  Checkbox,
  MultiColumnList,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import BasketList from './BasketList';

import buildGokbTIPPEntitlementOption from '../../registry/Gokb/buildGokbTIPPEntitlementOption';
import { buildPackageEntitlementOption, buildPCIEntitlementOption } from '../utilities';

import { gokbTipps } from '../../../test/jest/GOKB';
import { pcis, pkgs } from '../../../test/jest/eresources';


const onRemoveItem = jest.fn();
const onToggleAll = jest.fn();
const onToggleItem = jest.fn();

const thePkg = pkgs.find(p => p.id === 'eab7a8ea-6665-4f06-a55a-73a5aad36215');
const thePci = pcis.find(p => p.id === '1d7026ed-75f1-40d9-a167-632c6f3c5090');
const theTipp = gokbTipps.find(gkbt => gkbt.id === 27314502);

const basket = [
  buildGokbTIPPEntitlementOption(
    theTipp,
    thePkg
  ),
  buildPackageEntitlementOption(thePkg),
  buildPCIEntitlementOption(thePci)
];

describe('BasketList', () => {
  describe.each([
    {
      testLabel: 'with no selected items',
      selectedItems: {},
    },
    {
      testLabel: 'with the TIPP selected',
      selectedItems: { [theTipp.uuid]: true },
    },
    {
      testLabel: 'with everything selected',
      selectedItems: {
        [theTipp.uuid]: true,
        [thePci.id]: true,
        [thePkg.id]: true
      },
    }
  ])('rendering BasketList $testLabel', ({
    selectedItems
  }) => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <BasketList
            basket={basket}
            onRemoveItem={onRemoveItem}
            onToggleAll={onToggleAll}
            onToggleItem={onToggleItem}
            selectedItems={selectedItems}
          />
        </MemoryRouter>
      );
    });

    test('MutiColumnList is rendered', async () => {
      await MultiColumnList().exists();
    });

    test.each(basket)('selection is correct for item $id', async ({ id }) => {
      await Checkbox({ name: `selected-${id}` }).has({ checked: selectedItems[id] ?? false });
    });
  });
});

