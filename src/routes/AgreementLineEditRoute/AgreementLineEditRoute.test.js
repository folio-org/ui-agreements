import PropTypes from 'prop-types';

import { renderWithIntl, Button as ButtonInteractor } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';

import { useQuery } from 'react-query';

import { Button } from '@folio/stripes/components';
import {
  basket,
  match
} from './testResources';
import translationsProperties from '../../../test/helpers';
import AgreementLineEditRoute from './AgreementLineEditRoute';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};
const historyPushMock = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useSuppressFromDiscovery: jest.fn(() => () => true),
}));



jest.mock('../../components/views/AgreementLineForm', () => {
  return (props) => (
    <div>
      <div>AgreementLineForm</div>
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
    pathname: '/erm/agreements/...'
  },
  resources: {
    basket,
  },
  match
};

// Default mock implementation
useQuery.mockImplementation(() => ({ data: {}, isLoading: false }));

describe('AgreementLineEditRoute', () => {
  let renderComponent;
  describe('rendering the route from agreements', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineEditRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementLineForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLineForm')).toBeInTheDocument();
    });

    test('renders the CloseButton ', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalledWith(`/erm/agreements/${match.params?.agreementId}/line/${match.params?.lineId}`);
    });
  });

  describe('rendering the route from agreement lines', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineEditRoute
            {
              ...{
                ...data,
                location: {
                  ...data?.location,
                  pathname: '/erm/agreementLines/...'
                }
              }
            }
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreementLineForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLineForm')).toBeInTheDocument();
    });

    test('renders the CloseButton ', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalledWith(`/erm/agreementLines/${match.params?.lineId}/agreement/${match.params?.agreementId}`);
    });
  });

  describe('renders loading view', () => {
    beforeEach(() => {
      useQuery.mockImplementationOnce(() => ({ data: {}, isLoading: true }));
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineEditRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders loadingView', () => {
      const { getByText } = renderComponent;
      expect(getByText('LoadingView')).toBeInTheDocument();
    });
  });
});
