import { MemoryRouter } from 'react-router-dom';
import { useMutation } from 'react-query';

import { waitFor, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { Button as MockButton } from '@folio/stripes/components';
import {
  Button,
  PaneHeader,
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import { data as mockData, handlers } from './testResources';
import Basket from './Basket';


jest.mock('../../BasketList', () => () => <div>BasketList</div>);
jest.mock('../../AgreementModal', () => () => <div>AgreementModal</div>);
jest.mock('../../AgreementSearchButton', () => ({ onAgreementSelected }) => {
  return (
    <MockButton onClick={() => { onAgreementSelected(mockData.agreement); }}>
      AgreementSearchButton
    </MockButton>
  );
});

/* EXAMPLE Mocking useMutation to allow us to test the .then clause */
// THIS IS NOW DONE FOR US IN CENTRAL MOCKS
// Setting up jest fn here to test paramters passed in by component
/* const mockMutateAsync = jest.fn(() => Promise.resolve(true));
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
*/

describe('Basket', () => {
  describe.each([
    ['with e-resource', mockData, 'Showing 1 record', false],
    ['without e-resource', { basket: [] }, 'Showing 0 records', true]
  ])('testing', (description, basketData, expectedRecordText, isButtonDisabled) => {
    describe(description, () => {
      let renderComponent;
      beforeEach(() => {
        renderComponent = renderWithIntl(
          <MemoryRouter>
            <Basket
              data={basketData}
              handlers={handlers}
            />
          </MemoryRouter>,
          translationsProperties
        );
      });

      it('renders the expected Pane title', async () => {
        await PaneHeader('ERM basket').is({ visible: true });
      });

      it('renders the record count in the pane sub', () => {
        const { getByText } = renderComponent;
        expect(getByText(expectedRecordText)).toBeInTheDocument();
      });


      it('renders the close basket button', async () => {
        const { getByRole } = renderComponent;
        expect(getByRole('button', { name: 'Close basket' })).toBeInTheDocument();
      });

      it('renders the expected message banner text', () => {
        const { getByText } = renderComponent;
        expect(getByText('Select one or more e-resources and add them to a new or existing agreement. An agreement line will be created for each e-resource that you select.')).toBeInTheDocument();
      });

      it('renders the BasketList component', () => {
        const { getByText } = renderComponent;
        expect(getByText('BasketList')).toBeInTheDocument();
      });

      if (isButtonDisabled) {
        test('the Create New Agreement button is disabled', async () => {
          await Button('Create new agreement').is({ disabled: true });
        });
      } else {
        test('the Create New Agreement button is enabled', async () => {
          await Button('Create new agreement').is({ disabled: false });
        });
      }

      describe('clicking on the create new agreement button', () => {
        if (!isButtonDisabled) {
          it('triggers create agreement logic on button click', async () => {
            await waitFor(async () => {
              await Button('Create new agreement').click();
            });
            expect(useMutation).toHaveBeenCalled();
          });

          test('clicking the create new agreement button opens the agreementModal', async () => {
            const { getByText } = renderComponent;
            await waitFor(async () => {
              await Button('Create new agreement').click();
            });
            expect(getByText('AgreementModal')).toBeInTheDocument();
          });
        }
      });

      describe('calling the onClose handler', () => {
        if (!isButtonDisabled) {
          it('calls the onClose handler when the close button is clicked', async () => {
            const { getByRole } = renderComponent;
            // IconButton calls seem not to work as expected
            // await IconButton('Close basket').click();
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

      // FIXME: The test should check whether or not putAgreement is called, but it is currently fiddly due to mutateAsync.
      // This test currently does not verify whether the AgreementModal is opened or not
      // as the AgreementModal mock is always being rendered.
      describe('Selecting agreement', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('AgreementSearchButton').click();
          });
        });

        test('should open the modal', async () => {
          const { getByText } = renderComponent;
          await waitFor(() => {
            expect(getByText('AgreementModal')).toBeInTheDocument();
          });
        });
      });
    });
  });
});
