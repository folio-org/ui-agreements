
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import BasketRoute from './BasketRoute';
import resources from './testResources';

/* const handlers = {
  onAddToExistingAgreement: () => { },
  onClose: () => { }
};
 */
const AddToExistingAgreementButton = (handlers) => {
  return <Button onClick={handlers.onAddToExistingAgreement}>AddToExistingAgreementButton</Button>;
};

const CloseButton = (handlers) => {
  return <Button onClick={handlers.onClose}>CloseButton</Button>;
};

jest.mock('../../components/views/Basket', () => {
  return (props) => (
    <div>
      <div>Basket</div>
      <AddToExistingAgreementButton {...props} />
      <CloseButton {...props} />
    </div>
  );
});

const queryUpdateMock = jest.fn();
const historyGoBackMock = jest.fn();

const basketRouteProps = {
  history: {
    push: () => jest.fn(),
    goBack: () => historyGoBackMock,
  },
  mutator: {
    basket: {
      replace: () => jest.fn(),
    },
    openAgreements: {},
    query: { update: queryUpdateMock },
  },
  resources: { resources }
};

describe('BasketRoute', () => {
  describe('rendering the basket route', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <BasketRoute {...basketRouteProps} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the Basket component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Basket')).toBeInTheDocument();
    });

    test('renders the AddToExistingAgreementButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AddToExistingAgreementButton')).toBeInTheDocument();
    });

    // we check if the button is clicked it calls the queryUpdateMock(update) function to invoke the child callback (handleAddToNewAgreement) defined in Route
    /* test('calls the AddToExistingAgreementButton', async () => {
      await ButtonInteractor('AddToExistingAgreementButton').click();
      expect(queryUpdateMock).toHaveBeenCalled();
    }); */

    test('renders the CloseButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
    /* test('calls the CloseButton', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyGoBackMock).toHaveBeenCalled();
    }); */
  });
});
