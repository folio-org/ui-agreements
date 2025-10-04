import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import translationsProperties from '../../../test/helpers';
import AgreementEditRoute from './AgreementEditRoute';
import {
  agreement,
  basket,
  location,
  match,
} from './testResources';

import mockRefdata from '../../../test/jest/refdata';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
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
const onSubmitMock = jest.fn();
const mockSendCallout = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsRefdata: () => mockRefdata,
}));

const mockMutateAsync = jest.fn((values) => {
  // simulate what putAgreement does in the component
  mockSendCallout({
    type: 'success',
    message: { id: 'ui-agreements.agreements.update.callout', values: { name: values.name } },
  });
  return Promise.resolve({ name: values.name, linkedLicenses: [] });
});

jest.mock('react-query', () => {
  const { mockReactQuery } = jest.requireActual('@folio/stripes-erm-testing');
  return {
    ...jest.requireActual('react-query'),
    ...mockReactQuery,
    useMutation: () => ({ mutateAsync: mockMutateAsync }),
  };
});

jest.mock('@folio/stripes-erm-components', () => {
  const actual = jest.requireActual('@folio/stripes-erm-components');
  return {
    ...actual,
    useChunkedUsers: () => ({ users: [] }),
    useClaim: () => ({ claim: jest.fn(() => Promise.resolve()) }),
    useGetAccess: () => ({
      canRead: true,
      canEdit: true,
      canReadLoading: false,
      canEditLoading: false,
    }),
    usePolicies: () => ({ policies: [] }),
  };
});

jest.mock('react-query', () => {
  const { mockReactQuery } = jest.requireActual('@folio/stripes-erm-testing');
  return ({
    ...jest.requireActual('react-query'),
    ...mockReactQuery,
    useMutation: () => ({ mutateAsync: mockMutateAsync })
  });
});

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <div>
      <div>AgreementForm</div>
      <CloseButton {...props} />
      <SubmitButton onClick={() => props.onSubmit({ name: 'Test Agreement' })} />
    </div>
  );
});

const data = {
  history: {
    push: historyPushMock
  },
  location,
  match,
  resources: {
    basket,
  }
};

// Default mock implementation
useQuery.mockImplementation(() => ({ data: agreement, isLoading: false }));

describe('AgreementEditRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute {...data} onSubmit={onSubmitMock} />
        </MemoryRouter>,
        translationsProperties
      );
    });
    test('renders the AgreementForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementForm')).toBeInTheDocument();
    });

    test('calls the CloseButton', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });
      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('shows success callout for agreement update', async () => {
      await ButtonInteractor('SubmitButton').click();

      await waitFor(() => {
        expect(mockSendCallout).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'success',
            message: expect.any(Object),
          })
        );
      });
    });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      // We have multiple useQuery calls, so make sure they're all loading for this test
      useQuery.mockImplementation(() => ({ data: {}, isLoading: true }));
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    afterEach(() => {
      // Reset to the default implementation after this test
      useQuery.mockImplementation(() => ({ data: agreement, isLoading: false }));
    });

    test('renders loadingView', () => {
      const { getByText } = renderComponent;
      expect(getByText('LoadingView')).toBeInTheDocument();
    });
  });

  describe('rendering with no permissions', () => {
    let renderComponent;
    beforeEach(() => {
      // override hasPerm to return false
      useStripes.mockImplementation(() => ({
        hasPerm: jest.fn(() => false),
      }));

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementEditRoute
            {...data}
            stripes={{ hasPerm: () => false }}
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
