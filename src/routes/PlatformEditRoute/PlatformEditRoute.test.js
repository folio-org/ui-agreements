import PropTypes from 'prop-types';

import { useQuery } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import translationsProperties from '../../../test/helpers';
import PlatformEditRoute from './PlatformEditRoute';
import { platform } from './testResources';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};

const historyPushMock = jest.fn();
const onSubmitMock = jest.fn();



jest.mock('../../components/views/PlatformForm', () => {
  return (props) => (
    <div>
      <div>PlatformForm</div>
      <CloseButton {...props} />
    </div>
  );
});

const data = {
  history: {
    push: historyPushMock
  },
  location: {
    search: ''
  },
  match: {
    params: {
      id: ''
    }
  },
};

// Default mock implementation
useQuery.mockImplementation(() => ({ data: platform, isLoading: false }));

describe('PlatformEditRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformEditRoute {...data} onSubmit={onSubmitMock} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the PlatformForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PlatformForm')).toBeInTheDocument();
    });


    test('renders the CloseButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      useQuery.mockImplementationOnce(() => ({ data: {}, isLoading: true }));
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformEditRoute {...data} />
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
      // Mock hasPerm differently here
      const { hasPerm } = useStripes();
      hasPerm.mockImplementation(() => false);

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformEditRoute
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
