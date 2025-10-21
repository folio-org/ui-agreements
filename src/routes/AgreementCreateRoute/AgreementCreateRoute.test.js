import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  mockPost,
  mockKyJson,
  useStripes
} from '@folio/stripes/core';
import { Button as MockButton } from '@folio/stripes/components';

import { usePolicies } from '@folio/stripes-erm-components';
import { Button, Callout, renderWithIntl } from '@folio/stripes-erm-testing';

import { MemoryRouter } from 'react-router-dom';

import basket from './testResources';

import { useAddFromBasket } from '../../hooks';

import translationsProperties from '../../../test/helpers';
import mockRefdata from '../../../test/jest/refdata';
import AgreementCreateRoute from './AgreementCreateRoute';

const mockBasketLinesAdded = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAddFromBasket: jest.fn(() => ({
    isExternalEntitlementLoading: false,
    getAgreementLinesToAdd: () => [],
    handleBasketLinesAdded: mockBasketLinesAdded
  })),
  useAgreementsRefdata: () => mockRefdata,
}));

const historyPushMock = jest.fn();

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <>
      <div>AgreementForm</div>
      <MockButton onClick={props.handlers.onClose}>CloseButton</MockButton>
      <MockButton onClick={props.handlers.onBasketLinesAdded}>BasketLineButton</MockButton>
      <MockButton
        data-testid="submit-button"
        onClick={() => props.onSubmit({
          name: 'Test Agreement',
          fakeProp: true,
          claimPolicies: ['I am the claims']
        })}
      >
        SubmitButton
      </MockButton>
    </>
  );
});

const data = {
  history: {
    push: historyPushMock
  },
  location: {
    search: '',
    pathname: ''
  },
  resources: {
    basket,
  }
};

let renderComponent;
describe('AgreementCreateRoute', () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockKyJson.mockClear();

    mockKyJson.mockImplementation(() => Promise.resolve({ id: 'my-agreement-id', name: 'Test Agreement' }));
    usePolicies.mockImplementation(() => ({ policies: [] }));
  });

  describe('rendering the route with permissions', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementForm')).toBeInTheDocument();
    });

    test('renders the BasketLineButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketLineButton')).toBeInTheDocument();
    });

    test('calls the BasketLineButton', async () => {
      await waitFor(async () => {
        await Button('BasketLineButton').click();
      });
      await waitFor(async () => {
        expect(mockBasketLinesAdded).toHaveBeenCalled();
      });
    });

    // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
    test('calls the CloseButton', async () => {
      await waitFor(async () => {
        await Button('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    describe('clicking the submit button', () => {
      beforeEach(async () => {
        await Button('SubmitButton').click();
      });

      describe('testing Agreements POST', () => {
        // EXAMPLE testing POST calls are as expected
        test('mockPost was called first with agreements POST', async () => {
          await waitFor(() => {
            expect(mockPost.mock.calls[0][0]).toEqual('erm/sas');
          });
        });

        test('mockPost was called first with expected agreements POST payload', async () => {
          await waitFor(() => {
            expect(mockPost.mock.calls[0][1]).toEqual({
              json: {
                name: 'Test Agreement',
                inwardRelationships: [],
                outwardRelationships: [],
                fakeProp: true
              }
            });
          });
        });
      });

      describe('testing Claims POST', () => {
        test('mockPost was called second with claims POST', async () => {
          await waitFor(() => {
            expect(mockPost.mock.calls[1][0]).toEqual('erm/sas/my-agreement-id/claim');
          });
        });

        test('mockPost was called second with expected claims POST payload', async () => {
          await waitFor(() => {
            expect(mockPost.mock.calls[1][1]).toEqual({
              json: {
                'claims': ['I am the claims']
              }
            });
          });
        });
      });


      test('Shows agreement success callout', async () => {
        // EXAMPLE interactor selectors don't have injected intl values
        await Callout('<strong>Agreement created:</strong> {name}').exists();
      });

      test('Shows claims success callout', async () => {
        // EXAMPLE interactor selectors don't have injected intl values
        await Callout('<strong>Agreement acquisition units updated:</strong> {name}').exists();
      });
    });

    describe('handling claim errors', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      test('falls back to claimError.message if JSON parsing fails', async () => {
        // Mock Agreement POST success, Claim POST failure with invalid JSON
        mockKyJson
          .mockResolvedValueOnce({ id: 'my-agreement-id', name: 'Test Agreement' })
          .mockRejectedValueOnce({
            message: 'Something went wrong',
            response: {
              json: async () => {
                throw new Error('Invalid JSON');
              },
            },
          });

        const { getByText, queryAllByRole } = renderWithIntl(
          <MemoryRouter>
            <AgreementCreateRoute {...data} />
          </MemoryRouter>,
          translationsProperties
        );

        const buttons = queryAllByRole('button', { name: 'SubmitButton' });
        await buttons[0].click();

        await waitFor(() => {
          expect(mockKyJson).toHaveBeenCalledTimes(2);
        });

        await waitFor(() => {
          expect(getByText(/Acquisition units for agreement {name} were not updated: {error}/)).toBeInTheDocument();
        });
      });
    });
  });


  describe('rendering loading view', () => {
    beforeEach(() => {
      useAddFromBasket.mockImplementation(() => ({
        isExternalEntitlementLoading: true
      }));

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders loadingView', () => {
      const { getByText } = renderComponent;
      expect(getByText('LoadingView')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    beforeEach(() => {
      useStripes.mockImplementation(() => ({
        hasPerm: jest.fn(() => false),
      }));
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementCreateRoute
            {...data}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the permission error', () => {
      const { getByText } = renderComponent;
      expect(getByText('Sorry - your permissions do not allow access to this page.')).toBeInTheDocument();
    });
  });
});
