import { MemoryRouter, useLocation } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  Button,
  KeyValue,
  renderWithIntl
} from '@folio/stripes-erm-testing';
import { KeyValue as MockKeyValue } from '@folio/stripes/components';

import RouteSwitcher from './RouteSwitcher';
import translationsProperties from '../../../test/helpers';

const TestComponent = () => {
  const { pathname } = useLocation();
  return (
    <>
      <MockKeyValue
        label="PATH"
        value={pathname}
      />
      <RouteSwitcher />
    </>
  );
};

const AGREEMENT_TAB_BUTTONS = [
  {
    label: 'Agreements',
    redirect: '/erm/agreements'
  },
  {
    label: 'Agreement lines',
    redirect: '/erm/agreementLines'
  },
];

const KB_TAB_BUTTONS = [
  {
    label: 'Packages',
    redirect: '/erm/packages'
  },
  {
    label: 'Titles',
    redirect: '/erm/titles'
  },
  {
    label: 'Platforms',
    redirect: '/erm/platforms'
  },
];

describe('RouteSwitcher', () => {
  // EXAMPLE we actually want to test location work here.
  useLocation.mockImplementation(() => {
    const { useLocation: actualUseLocation } = jest.requireActual('react-router-dom');
    return actualUseLocation();
  });

  describe.each([
    {
      name: 'agreements tab',
      config: [
        {
          url: '/erm/agreements',
          primary: AGREEMENT_TAB_BUTTONS.filter(atb => atb.label === 'Agreements'),
        },
        {
          url: '/erm/agreementLines',
          primary: AGREEMENT_TAB_BUTTONS.filter(atb => atb.label === 'Agreement lines'),
        }
      ],
      expectedButtons: AGREEMENT_TAB_BUTTONS
    },
    {
      name: 'kb tab',
      config: [
        {
          url: '/erm/packages',
          primary: KB_TAB_BUTTONS.filter(ktb => ktb.label === 'Packages'),
        },
        {
          url: '/erm/titles',
          primary: KB_TAB_BUTTONS.filter(ktb => ktb.label === 'Titles'),
        },
        {
          url: '/erm/platforms',
          primary: KB_TAB_BUTTONS.filter(ktb => ktb.label === 'Platforms'),
        }
      ],
      expectedButtons: KB_TAB_BUTTONS
    }
  ])('rendering RouteSwitcher for $name', ({ config, expectedButtons }) => {
    describe.each(config)('rendering RouteSwitcher component at url: $url', ({ url, primary }) => {
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter
            initialEntries={[url]}
            initialIndex={0}
          >
            <TestComponent />
          </MemoryRouter>,
          translationsProperties
        );
      });

      test(`pathname is ${url}`, async () => {
        await waitFor(async () => {
          await KeyValue('PATH').has({ value: url });
        });
      });

      describe.each(expectedButtons)('$label button', ({ label, redirect }) => {
        test(`${label} button exists`, async () => {
          await waitFor(async () => {
            await Button(label).exists();
          });
        });

        describe(`clicking ${label} button`, () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button(label).click();
            });
          });

          if (label === primary.label) {
            // We should be on primary already, no redirect
            test(`pathname is ${url}`, async () => {
              await waitFor(async () => {
                await KeyValue('PATH').has({ value: url });
              });
            });
          } else {
            // We should have redirected
            test(`pathname is ${redirect}`, async () => {
              await waitFor(async () => {
                await KeyValue('PATH').has({ value: redirect });
              });
            });
          }
        });
      });
    });
  });
});
