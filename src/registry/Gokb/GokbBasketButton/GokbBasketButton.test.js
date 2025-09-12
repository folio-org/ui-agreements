import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  Button,
  Dropdown,
  IconButton, IconElement,
  renderWithIntl,
  Tooltip
} from '@folio/stripes-erm-testing';

import { gokbTipps } from '../../../../test/jest/GOKB';
import translationsProperties from '../../../../test/helpers';

import { GokbBasketButton } from '../index';
import { pcis, pkgs } from '../../../../test/jest/eresources';
import { buildPackageEntitlementOption, buildPCIEntitlementOption } from '../../../components/utilities';
import { BASKET_TYPE_GOKB_TITLE } from '../../../constants';

// Allow IconButtons as normal
jest.unmock('@folio/stripes/components');

const relevantPci = pcis.find(p => p.id === '1d7026ed-75f1-40d9-a167-632c6f3c5090'); // The PCI from local resources
const relevantPkg = pkgs.find(p => p.id === '9bd869e3-6c3c-42d2-aaf6-96d2725e71f3'); // The package from local resources

const relevantTipp = gokbTipps.find(gkbt => gkbt.id === 5994401);

const mockAddToBasket = jest.fn();
const mockRemoveFromBasket = jest.fn();
const mockExistsInBasket = jest.fn(() => false);

jest.mock('../../../hooks', () => ({
  useBasket: jest.fn(() => ({
    addToBasket: mockAddToBasket,
    removeFromBasket: mockRemoveFromBasket,
    existsInBasket: mockExistsInBasket
  })),
}));

describe('GokbBasketButton', () => {
  describe.each([
    {
      testTitle: 'without PCI or PKG in local kb',
      props: {},
      expectTooltip: 'Accounting Finance and Economics eJournal collection not in local KB'
    },
    {
      testTitle: 'PKG in local kb, PCI is not',
      props: {
        pkg: relevantPkg
      },
      expectTooltip: 'Manage basket for Accounting Finance and Economics eJournal collection',
      expectedDropdownOptions: [
        {
          icon: 'plus-sign',
          label: 'Add title to basket',
          expectedAddShape: {
            id: relevantTipp.id,
            name: relevantTipp.name,
            type: BASKET_TYPE_GOKB_TITLE,
            tipp: relevantTipp,
            pkg: relevantPkg,
            _object: relevantTipp
          }, // Built shape
        },
        {
          icon: 'plus-sign',
          label: 'Add package to basket',
          expectedAddShape: buildPackageEntitlementOption(relevantPkg),
        }
      ]
    },
    {
      testTitle: 'PKG loading, PCI in system',
      props: {
        pci: relevantPci,
        pkgLoading: true
      },
      expectTooltip: 'Manage basket for Accounting Finance and Economics eJournal collection',
      expectedDropdownOptions: [
        {
          icon: 'plus-sign',
          label: 'Add title to basket',
          expectedAddShape: buildPCIEntitlementOption(relevantPci),
        },
        {
          icon: 'spinner-ellipsis',
          label: 'Add package to basket',
          disabled: true,
        }
      ]
    },
    {
      testTitle: 'PCI loading',
      props: {
        pkg: relevantPkg,
        pciLoading: true,
      },
      expectTooltip: 'Manage basket for Accounting Finance and Economics eJournal collection',
      expectedDropdownOptions: [
        {
          icon: 'spinner-ellipsis',
          label: 'Add title to basket',
          disabled: true,
        },
        {
          icon: 'plus-sign',
          label: 'Add package to basket',
          expectedAddShape: buildPackageEntitlementOption(relevantPkg),
        }
      ]
    },
    {
      testTitle: 'PKG/PCI loading',
      props: {
        pkgLoading: true,
        pciLoading: true,
      },
      expectTooltip: 'Manage basket for Accounting Finance and Economics eJournal collection',
      expectedDropdownOptions: [
        {
          icon: 'spinner-ellipsis',
          label: 'Add title to basket',
          disabled: true,
        },
        {
          icon: 'spinner-ellipsis',
          label: 'Add package to basket',
          disabled: true,
        }
      ],
    },
    {
      testTitle: 'PKG/PCI in local KB',
      props: {
        pkg: relevantPkg,
        pci: relevantPci,
      },
      expectTooltip: 'Manage basket for Accounting Finance and Economics eJournal collection',
      expectedDropdownOptions: [
        {
          icon: 'plus-sign',
          label: 'Add title to basket',
          expectedAddShape: buildPCIEntitlementOption(relevantPci),
        },
        {
          icon: 'plus-sign',
          label: 'Add package to basket',
          expectedAddShape: buildPackageEntitlementOption(relevantPkg),
        }
      ]
    },
    {
      testTitle: 'PKG/PCI in local KB, both in basket',
      props: {
        pkg: relevantPkg,
        pci: relevantPci,
      },
      existsInBasketImplementation: () => true,
      expectTooltip: 'Manage basket for Accounting Finance and Economics eJournal collection',
      expectedDropdownOptions: [
        {
          icon: 'trash',
          label: 'Remove title from basket',
          expectedRemoveShape: buildPCIEntitlementOption(relevantPci),
        },
        {
          icon: 'trash',
          label: 'Remove package from basket',
          expectedRemoveShape: buildPackageEntitlementOption(relevantPkg),
        }
      ]
    }
  ])('$testTitle', ({
    existsInBasketImplementation,
    expectedDropdownOptions,
    expectTooltip,
    props,
  }) => {
    beforeEach(() => {
      mockAddToBasket.mockClear();
      mockRemoveFromBasket.mockClear();
      mockExistsInBasket.mockClear();
      if (existsInBasketImplementation) {
        mockExistsInBasket.mockImplementation(existsInBasketImplementation);
      } else {
        mockExistsInBasket.mockImplementation(() => false);
      }

      renderWithIntl(
        <GokbBasketButton
          tipp={relevantTipp}
          {...props}
        />,
        translationsProperties
      );
    });

    test('should render an iconButton', async () => {
      await IconButton().has({ icon: 'ellipsis' });
    });

    test('IconButton has expected tooltip', async () => {
      // Tooltip Proximity is a little broken in interactors :/
      await Tooltip(expectTooltip).has({ proximity: true });
    });

    if ((expectedDropdownOptions?.length ?? -1) > 0) {
      test('should render a Dropdown', async () => {
        await Dropdown().exists();
      });

      describe.each(expectedDropdownOptions)('testing Dropdown option "$label"', ({
        disabled,
        expectedAddShape,
        expectedRemoveShape,
        label,
        icon
      }) => {
        test('should render the option as hidden', async () => {
          await Button({ text: label, visible: false, disabled: !!disabled }).exists();
        });

        test('should render the Icon as hidden', async () => {
          // Find the non-visible button for now
          await Button({ text: label, visible: false, disabled: !!disabled }).find(IconElement(icon)).exists();
        });

        describe('opening Dropdown', () => {
          beforeEach(async () => {
            await Dropdown().open();
          });

          test('should render the option as visible', async () => {
            await Button({ text: label, disabled: !!disabled }).exists();
          });

          test('should render the Icon as visible', async () => {
            await Button({ text: label, disabled: !!disabled }).find(IconElement(icon)).exists();
          });

          if (disabled === true) {
            test('button should be disabled', async () => {
              await Button(label).has({ disabled: true });
            });
          } else {
            describe(`clicking ${label}`, () => {
              beforeEach(async () => {
                await waitFor(async () => {
                  await Button(label).click();
                });
              });

              if (expectedAddShape) {
                test('addToBasket should have been called with expected shape', () => {
                  expect(mockAddToBasket.mock.calls[0][0]).toEqual(expectedAddShape);
                });
              } else {
                test('removeFromBasket should have been called with expected shape', () => {
                  expect(mockRemoveFromBasket.mock.calls[0][0]).toEqual(expectedRemoveShape);
                });
              }
            });
          }
        });
      });
    }
  });
});
