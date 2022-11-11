import PropTypes from 'prop-types';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import { useQuery } from 'react-query';
import { useStripes } from '@folio/stripes/core';

import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import EResourceEditRoute from './EResourceEditRoute';
import { eresource } from './testResources';

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

jest.mock('../../components/views/PCIForm', () => {
  return (props) => (
    <div>
      <div>PCIForm</div>
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
useQuery.mockImplementation(() => ({ data: eresource, isLoading: false }));

describe('EResourceEditRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourceEditRoute {...data} onSubmit={onSubmitMock} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the PCIForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PCIForm')).toBeInTheDocument();
    });


    test('renders the CloseButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });
  });

  describe('rendering loading view', () => {
    let renderComponent;
    beforeEach(() => {
      useQuery.mockImplementation(() => ({ data: {}, isLoading: true }));
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourceEditRoute {...data} />
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
          <EResourceEditRoute
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
