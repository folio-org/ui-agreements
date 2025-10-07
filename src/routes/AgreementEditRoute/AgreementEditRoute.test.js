import { useQuery } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button, Callout, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button as MockButton } from '@folio/stripes/components';
import {
  mockPost,
  mockKyJson,
  useStripes
} from '@folio/stripes/core';

import translationsProperties from '../../../test/helpers';
import AgreementEditRoute from './AgreementEditRoute';
import {
  agreement,
  basket,
  location,
  match,
} from './testResources';

import mockRefdata from '../../../test/jest/refdata';

const historyPushMock = jest.fn();
const onSubmitMock = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsRefdata: () => mockRefdata,
}));

jest.mock('../../components/views/AgreementForm', () => {
  return (props) => (
    <>
      <div>AgreementForm</div>
      <MockButton onClick={props.handlers.onClose}>CloseButton</MockButton>
      <MockButton
        onClick={() => props.onSubmit({
          name: 'Test Agreement',
          fakeProp: true,
          claimPolicies: 'I am the claims'
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
  location,
  match,
  resources: {
    basket,
  }
};

// Default mock implementation
useQuery.mockImplementation(() => ({ data: agreement, isLoading: false }));

describe('AgreementEditRoute', () => {
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

      test('Shows agreement edit success callout', async () => {
        // EXAMPLE interactor selectors don't have injected intl values
        await Callout('<strong>Agreement updated:</strong> {name}').exists();
      });

      test('Shows claims edit success callout', async () => {
        // EXAMPLE interactor selectors don't have injected intl values
        await Callout('<strong>Agreement acquisition units updated:</strong> {name}').exists();
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
