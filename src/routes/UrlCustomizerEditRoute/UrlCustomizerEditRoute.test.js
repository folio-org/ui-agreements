import PropTypes from 'prop-types';

import { MemoryRouter } from 'react-router-dom';
import { useQuery } from 'react-query';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

import translationsProperties from '../../../test/helpers';
import UrlCustomizerEditRoute from './UrlCustomizerEditRoute';


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


jest.mock('../../components/views/UrlCustomizerForm', () => {
  return (props) => (
    <div>
      <div>UrlCustomizerForm</div>
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
      platformId: '082ef5fe-fac7-46ba-a37c-b636ae7aa266',
      templateId: '8c195c10-086a-4c51-a7cb-d3e5d66b4042'
    }
  },
};

describe('UrlCustomizerEditRoute', () => {
  describe('rendering the route with permissions', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerEditRoute {...data} onSubmit={onSubmitMock} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the UrlCustomizerForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('UrlCustomizerForm')).toBeInTheDocument();
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
      // EXAMPLE overriding react-query useQuery for a single test
      // These work because our manual mocks have set up a jest.fn we can override here already
      useQuery.mockImplementation(() => ({
        isLoading: true
      }));

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerEditRoute {...data} />
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
      // EXAMPLE overriding stripes-core hasPerm for a single test
      // These work because our manual mocks have set up a jest.fn we can override here already
      useStripes.mockImplementation(() => ({
        hasPerm: () => false
      }));

      renderComponent = renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerEditRoute
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
