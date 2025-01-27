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

jest.mock('../../BasketList', () => () => <div>BasketList</div>);
jest.mock('../../AgreementSearchButton', () => () => <div>AgreementSearchButton</div>);

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
  describe('Basket with data', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Basket
            data={data}
            handlers={handlers}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('useMutation has been called', () => {
      expect(useMutation).toHaveBeenCalled();
    });

    it('triggers create agreement logic on button click', async () => {
      await waitFor(async () => {
        await Button('Create new agreement').click();
      });
      expect(useMutation).toHaveBeenCalled();
    });

    it('renders the expected Pane title', async () => {
      await PaneHeader('ERM basket').is({ visible: true });
    });

    it('renders the expected message banner text', () => {
      const { getByText } = renderComponent;
      expect(getByText('Select one or more e-resources and add them to a new or existing agreement. An agreement line will be created for each e-resource that you select.')).toBeInTheDocument();
    });

    it('renders the BasketList component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketList')).toBeInTheDocument();
    });

    it('renders the create new agreement button', async () => {
      await Button('Create new agreement').exists();
    });

    it('clicking the create agreement button', async () => {
      await waitFor(async () => {
        await Button('Create new agreement').exists();
        await Button('Create new agreement').click();
      });
    });

    it('renders the record count in the pane sub', () => {
      const { getByText } = renderComponent;
      expect(getByText('Showing 1 record')).toBeInTheDocument();
    });

    it('renders the AgreementSearchButton component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementSearchButton')).toBeInTheDocument();
    });
  });

  describe('Basket without data', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Basket
            data={{ basket: [] }}
            handlers={handlers}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the close basket button', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Close basket' })).toBeInTheDocument();
    });

    it('calls the onClose handler when the close button is clicked', async () => {
      const { getByRole } = renderComponent;
      const closeButton = getByRole('button', { name: 'Close basket' });
      fireEvent.click(closeButton);
      expect(handlers.onClose).toHaveBeenCalledTimes(1);
    });

    it('it renders the AgreementSearchButton component', () => {
      const { queryByText } = renderComponent;
      expect(queryByText('AgreementSearchButton')).toBeInTheDocument();
    });

    it('renders the record count in the pane sub', () => {
      const { getByText } = renderComponent;
      expect(getByText('Showing 0 records')).toBeInTheDocument();
    });

    it('renders the create new agreement button', async () => {
      await Button('Create new agreement').is({ disabled: true });
    });

    it('renders the message banner text', () => {
      const { getByText } = renderComponent;
      expect(getByText('Select one or more e-resources and add them to a new or existing agreement. An agreement line will be created for each e-resource that you select.')).toBeInTheDocument();
    });
  });
});
