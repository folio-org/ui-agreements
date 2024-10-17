import { MemoryRouter } from 'react-router-dom';

import { useMutation } from 'react-query';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  Button,
  PaneHeader,
  renderWithIntl,
  Selection,
  SelectionList,
  SelectionOption
} from '@folio/stripes-erm-testing';

import Basket from './Basket';

import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';

jest.mock('../../BasketList', () => () => <div>BasketList</div>);

/* EXAMPLE Mocking useMutation to allow us to test the .then clause */
// Setting up jest fn here to test paramters passed in by component
const mockMutateAsync = jest.fn(() => Promise.resolve(true));
jest.mock('react-query', () => {
  const { mockReactQuery } = jest.requireActual('@folio/stripes-erm-testing');

  return {
    ...jest.requireActual('react-query'),
    ...mockReactQuery,
    useMutation: jest.fn((_key, func) => ({
      mutateAsync: (...incomingParams) => {
        // Actually call function coming from component
        // This assumes that ky has been mocked, which it should have been by __mocks__ stripes-core.

        // If this function was async, we might need to do something different.
        // As it is, it's a synchronous call to ky which returns a promise we then chain on.
        func();

        // Ensure we return the promise resolve from above, so that any _subsequent_ .then calls can flow
        return mockMutateAsync(...incomingParams);
      }
    })),
  };
});

describe('Basket', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Basket
          data={data}
          handlers={handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('useMutation has been called', () => {
    expect(useMutation).toHaveBeenCalled();
  });

  it('renders the expected Pane title', async () => {
    await PaneHeader('ERM basket').is({ visible: true });
  });

  it('renders the expected message banner text', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select one or more e-resources and add them to a new or existing agreement. An agreement line will be created for each e-resource that you select.')).toBeInTheDocument();
  });

  it('renders the BasketList component', () => {
    const { getByText } = renderComponent;
    expect(getByText('BasketList')).toBeInTheDocument();
  });

  it('renders the create new agreement button', async () => {
    await Button('Create new agreement').exists();
  });

  describe('Choosing an option and clicking the add to selected agreement button', () => {
    describe('Opening agreement selection', () => {
      beforeEach(async () => {
        await Selection({ id: 'select-agreement-for-basket' }).exists();
        await waitFor(async () => {
          await Selection().open();
        });
      });

      test('The right number of options show', async () => {
        await SelectionList({ optionCount: 9 }).exists();
      });

      describe('Filtering the selection list', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Selection().filterOptions('MR agreement test');
          });
        });

        test('There is now only one option', async () => {
          await SelectionList({ optionCount: 1 }).exists();
        });

        describe('Selecting an agreement', () => {
          beforeEach(async () => {
            await SelectionOption(/MR agreement test/i).click();
          });

          test('The selected agreement button is now active', async () => {
            await Button('Add to selected agreement').exists();
          });

          describe('Adding to selected agreement', () => {
            beforeEach(async () => {
              await waitFor(async () => {
                await Button('Add to selected agreement').click();
              });
            });

            test('mutate async called as expected', async () => {
              await waitFor(async () => {
                expect(mockMutateAsync.mock.calls[0][0]).toBeInstanceOf(Object);
                expect(mockMutateAsync.mock.calls[0][0].items).toBeInstanceOf(Array);

                expect(mockMutateAsync.mock.calls[0][0].items[0]).toStrictEqual({
                  resource: data.basket[0]
                });
              });
            });
          });
        });
      });
    });
  });

  it('clicking the create agreement button', async () => {
    await waitFor(async () => {
      await Button('Create new agreement').exists();
      await Button('Create new agreement').click();
    });
  });
});
