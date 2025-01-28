import { MemoryRouter } from 'react-router-dom';
import { useMutation } from 'react-query';
import { waitFor, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import {
  Button,
  PaneHeader,
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import Basket from './Basket';

import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';

jest.mock('../../BasketList', () => (props) => (
  <div>
    <input type="checkbox" />
    <button icon="trash" onClick={() => props.handlers.onRemoveBasketItem()} type="button">Remove</button>
    BasketList
  </div>
));
jest.mock('../../AgreementSearchButton', () => () => <div>AgreementSearchButton</div>);
jest.mock('../../AgreementModal', () => () => <div>AgreementModal</div>);

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
  describe.each([
    ['with e-resource', data, 'Showing 1 record', false],
    ['without e-resource', { basket: [] }, 'Showing 0 records', true]
  ])('testing', (description, basketData, expectedRecordText, isButtonDisabled) => {
    describe(description, () => {
      let renderComponent;
      beforeEach(() => {
        renderComponent = renderWithIntl(
          <MemoryRouter>
            <Basket data={basketData} handlers={handlers} />
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

      it('renders the BasketList component', () => {
        const { getByText } = renderComponent;
        expect(getByText('BasketList')).toBeInTheDocument();
      });

      if (isButtonDisabled) {
        test('the Create New Agreement button is disabled', async () => {
          await Button('Create new agreement').is({ disabled: true });
        });
      }

      describe(' clicking on the create agreement button', () => {
        if (!isButtonDisabled) {
          it('triggers create agreement logic on button click', async () => {
            await waitFor(async () => {
              await Button('Create new agreement').click();
            });
            expect(useMutation).toHaveBeenCalled();
          });

          it('clicking the create new agreement button opens the agreementModal', async () => {
            const { getByText } = renderComponent;
            await waitFor(async () => {
              await Button('Create new agreement').click();
            });
            expect(getByText('AgreementModal')).toBeInTheDocument();
          });
        }
      });

      it('toggles item selection', async () => {
        const { getByText } = renderComponent;
        const basketList = getByText('BasketList');

        const checkbox = basketList.querySelector('input[type="checkbox"]');
        expect(checkbox).toBeInTheDocument();

        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);

        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(false);
      });

      it('renders the close basket button', async () => {
        const { getByRole } = renderComponent;
        expect(getByRole('button', { name: 'Close basket' })).toBeInTheDocument();
      });

      describe('calling the onClose handler', () => {
        if (!isButtonDisabled) {
          it('calls the onClose handler when the close button is clicked', async () => {
            const { getByRole } = renderComponent;
            const closeButton = getByRole('button', { name: 'Close basket' });
            fireEvent.click(closeButton);
            expect(handlers.onClose).toHaveBeenCalledTimes(1);
          });
        }
      });

      it('renders the AgreementSearchButton component', () => {
        const { getByText } = renderComponent;
        expect(getByText('AgreementSearchButton')).toBeInTheDocument();
      });

      it('renders the AgreementModal component', () => {
        const { getByText } = renderComponent;
        expect(getByText('AgreementModal')).toBeInTheDocument();
      });

      it('renders the expected message banner text', () => {
        const { getByText } = renderComponent;
        expect(getByText('Select one or more e-resources and add them to a new or existing agreement. An agreement line will be created for each e-resource that you select.')).toBeInTheDocument();
      });

      it('renders the record count in the pane sub', () => {
        const { getByText } = renderComponent;
        expect(getByText(expectedRecordText)).toBeInTheDocument();
      });
    });
  });
});
