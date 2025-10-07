import PropTypes from 'prop-types';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  mockPost,
  mockKyJson
} from '@folio/stripes/core';

import { Button as ButtonInteractor, Callout, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';
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

const BasketLineButton = (props) => {
  return <Button onClick={props.handlers.onBasketLinesAdded}>BasketLineButton</Button>;
};

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

BasketLineButton.propTypes = {
  handlers: PropTypes.shape({
    onBasketLinesAdded: PropTypes.func,
  }),
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};

const SubmitButton = (props) => {
  return <Button onClick={props.onClick}>SubmitButton</Button>;
};

const historyPushMock = jest.fn();

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <div>
      <div>AgreementForm</div>
      <CloseButton {...props} />
      <BasketLineButton {...props} />
      <SubmitButton
        onClick={() => props.onSubmit({
          name: 'Test Agreement',
          fakeProp: true,
          claimPolicies: 'I am the claims'
        })}
      />
    </div>
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

// jest.mock('@folio/stripes/core', () => {
//   const actual = jest.requireActual('@folio/stripes/core');
//   const mocks = jest.requireActual('@folio/stripes-erm-testing/jest/mocks/mockStripesCore');
//   return {
//     ...actual,
//     ...mocks,

//   };
// });

describe('AgreementCreateRoute', () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockKyJson.mockClear();

    mockKyJson.mockImplementation(() => Promise.resolve({ id: 'my-agreement-id', name: 'Test Agreement' }));
  });

  describe('rendering the route with permissions', () => {
    let renderComponent;
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
        await ButtonInteractor('BasketLineButton').click();
      });
      await waitFor(async () => {
        expect(mockBasketLinesAdded).toHaveBeenCalled();
      });
    });

    // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
    test('calls the CloseButton', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    describe('clicking the submit button', () => {
      beforeEach(async () => {
        await ButtonInteractor('SubmitButton').click();
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
                'claims': 'I am the claims'
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

  // describe('rendering loading view', () => {
  //   let renderComponent;
  //   beforeEach(() => {
  //     useAddFromBasket.mockImplementationOnce(() => ({
  //       ...useAddFromBasket(),
  //       isExternalEntitlementLoading: true
  //     }));
  //     renderComponent = renderWithIntl(
  //       <MemoryRouter>
  //         <AgreementCreateRoute {...data} />
  //       </MemoryRouter>,
  //       translationsProperties
  //     );
  //   });

  //   test('renders loadingView', () => {
  //     const { getByText } = renderComponent;
  //     expect(getByText('LoadingView')).toBeInTheDocument();
  //   });
  // });

  // describe('rendering with no permissions', () => {
  //   let renderComponent;
  //   beforeEach(() => {
  //     // override hasPerm to return false
  //     // useStripes.mockImplementation(() => ({
  //     //   hasPerm: jest.fn(() => false),
  //     // }));
  //     renderComponent = renderWithIntl(
  //       <MemoryRouter>
  //         <AgreementCreateRoute
  //           {...data}
  //         />
  //       </MemoryRouter>,
  //       translationsProperties
  //     );
  //   });

  //   test('displays the permission error', () => {
  //     const { getByText } = renderComponent;
  //     expect(getByText('Sorry - your permissions do not allow access to this page.')).toBeInTheDocument();
  //   });
  });
});
