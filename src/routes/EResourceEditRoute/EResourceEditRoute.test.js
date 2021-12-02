import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import { noop } from 'lodash';
import translationsProperties from '../../../test/helpers';
import EResourceEditRoute from './EResourceEditRoute';
import { eresource, settings, loadingView } from './testResources';

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

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => <div>LoadingView</div>,
}));

jest.mock('../../components/views/PCIForm', () => {
  return (props) => (
    <div>
      <div>PCIForm</div>
      <CloseButton {...props} />
    </div>
  );
});

const data = {
  checkAsyncValidation: () => jest.fn(),
  history: {
    push: historyPushMock
  },
  location: {
    search: ''
  },
  mutator: {
    pci: {
      PUT: noop
    },
    title: {
      PUT: noop
    },
  },
  match: {
    params: {
      id: ''
    }
  },
  resources: {
    eresource,
    settings,
  }
};

const isPendingData = {
  checkAsyncValidation: () => jest.fn(),
  history: {
    push: () => jest.fn()
  },
  location: {
    search: {}
  },
  match: {
    params: {}
  },
  mutator: {
    pci: {
      PUT: noop
    },
    title: {
      PUT: noop
    },
  },
  resources: {
    loadingView
  }
};

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
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourceEditRoute {...isPendingData} />
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
