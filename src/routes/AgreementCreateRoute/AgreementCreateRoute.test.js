import PropTypes from 'prop-types';


import { useStripes } from '@folio/stripes/core';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

import basket from './testResources';

import { useAddFromBasket } from '../../hooks';

import translationsProperties from '../../../test/helpers';
import AgreementCreateRoute from './AgreementCreateRoute';
import mockRefdata from '../../../test/jest/refdata';



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

const historyPushMock = jest.fn();

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <div>
      <div>AgreementForm</div>
      <BasketLineButton {...props} />
      <CloseButton {...props} />
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

describe('AgreementCreateRoute', () => {
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
      await ButtonInteractor('BasketLineButton').click();
      expect(mockBasketLinesAdded).toHaveBeenCalled();
    });

    // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
    test('calls the CloseButton', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      useAddFromBasket.mockImplementationOnce(() => ({
        ...useAddFromBasket(),
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
    let renderComponent;
    beforeEach(() => {
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);
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
