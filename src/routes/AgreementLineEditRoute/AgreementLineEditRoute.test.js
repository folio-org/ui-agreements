import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import {
  entitlements,
  line,
  basket,
  orderLines,
  settings,
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

jest.mock('@folio/stripes/components', () => ({
    ...jest.requireActual('@folio/stripes/components'),
    LoadingView: () => <div>LoadingView</div>,
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
    isSuppressFromDiscoveryEnabled: () => jest.fn(),
    history: {
        push: historyPushMock
    },
    location: {
        search: ''
    },
    mutator: {
        entitlements: {
            PUT: noop,
        },
        line: {
            GET: noop,
            reset: () => {},
        },
        orderLines: {
            GET: noop,
            reset: () => {},
        }
    },
    resources: {
      line,
      settings,
      orderLines,
      basket,
      entitlements
     },
    match
};

const isLoadingData = {
  isSuppressFromDiscoveryEnabled: () => jest.fn(),
  history: {
      push: historyPushMock
  },
  location: {
      search: ''
  },
  mutator: {
      entitlements: {
          PUT: noop,
      },
      line: {
          GET: noop,
      },
      orderLines: {
          GET: noop,
      }
  },
  resources: {
    line,
    settings,
    orderLines,
    basket,
    entitlements
   },
  match,
};

describe('AgreementLineEditRoute', () => {
    let renderComponent;
  describe('rendering the route', () => {
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
      expect(historyPushMock).toHaveBeenCalled();
    });
  });

  describe('renders loading view', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineEditRoute {...isLoadingData} />
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
