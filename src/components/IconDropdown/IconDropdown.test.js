import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  Button,
  Dropdown,
  IconButton,
  IconElement,
  Tooltip,
  renderWithIntl
} from '@folio/stripes-erm-testing';
import IconDropdown from './IconDropdown';
import translationsProperties from '../../../test/helpers';

// We're going to leave Icon and IconButton as is
jest.unmock('@folio/stripes/components');

const func1 = jest.fn();
const func2 = jest.fn();

describe('IconDropdown', () => {
  describe.each([
    {
      props: {
        options: [
          {
            icon: 'trash',
            label: 'Do trash',
            onClick: func1
          },
          {
            icon: 'cancel',
            label: 'Do cancel',
            onClick: func2
          }
        ]
      },
      testLabel: 'testing a basic IconDropdown',
    },
    {
      props: {
        options: [
          {
            icon: 'trash',
            label: 'Do trash',
            onClick: func1
          },
          {
            label: 'Do cancel',
            onClick: func2
          }
        ]
      },
      testLabel: 'testing an IconDropdown where an option has no icon',
    },
    {
      props: {
        options: [
          {
            icon: 'trash',
            label: 'Do trash',
            onClick: func1
          }
        ],
        icon: 'check-circle'
      },
      testLabel: 'testing an IconDropdown with changed icon',
    },
    {
      props: {
        options: [
          {
            icon: 'trash',
            label: 'Do trash',
            onClick: func1
          }
        ],
        triggerProps: {
          ariaLabel: 'wibble'
        }
      },
      testLabel: 'testing an IconDropdown with ariaLabel trigger props',
    },
    {
      props: {
        options: [
          {
            icon: 'trash',
            label: 'Do trash',
            onClick: func1
          }
        ],
        triggerProps: {
          tooltipProps: {
            text: 'I AM A TEST'
          }
        }
      },
      testLabel: 'testing an IconDropdown with trigger tooltip props',
    }
  ])('$testLabel', ({ props }) => {
    beforeEach(() => {
      renderWithIntl(
        <IconDropdown
          {...props}
        />,
        translationsProperties
      );
    });

    test('renders a Dropdown component', async () => {
      await Dropdown().exists();
    });

    test.each(props.options?.map(opt => opt.label))('%s button is hidden', async (buttonLabel) => {
      await Button(buttonLabel).has({ visible: false });
    });

    test(`renders an IconButton trigger with ${props.icon ?? 'ellipsis'} icon`, async () => {
      await IconButton().has({ icon: props.icon ?? 'ellipsis' });
    });

    test(`IconButton trigger has expected ariaLabel: ${props.triggerProps?.ariaLabel ?? props.icon ?? 'ellipsis'}`, async () => {
      await IconButton(props.triggerProps?.ariaLabel ?? props.icon ?? 'ellipsis').exists();
    });

    if (Object.keys(props.triggerProps?.tooltipProps ?? {}).length > 0) {
      test('IconButton trigger should have a tooltip', async () => {
        // EXAMPLE working with Tooltip interactor
        // For some reason proximity == true breaks this...
        await Tooltip(props.triggerProps?.tooltipProps?.text).has({ proximity: true });
      });
    } else {
      test('IconButton trigger should not have a tooltip', async () => {
        await Tooltip().absent();
      });
    }

    describe('clicking the trigger', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await IconButton().click();
        });
      });

      describe.each(props.options)('testing $label button', ({ icon, label, onClick }) => {
        test(`${label} button is visible`, async () => {
          await waitFor(async () => {
            await Button(label).has({ visible: true });
          });
        });

        test(`${label} button contains an ${icon ?? 'ellipsis'} icon`, async () => {
          // EXAMPLE Icon testing using IconElement interactor
          await waitFor(async () => {
            await Button(label).find(IconElement(icon)).exists();
          });
        });

        describe(`clicking the ${label} button`, () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button(label).click();
            });
          });

          test('expected callback is called', async () => {
            await waitFor(() => {
              expect(onClick).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
