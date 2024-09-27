import PropTypes from 'prop-types';

import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';

import AgreementLineCreateRoute from './AgreementLineCreateRoute';

import translationsProperties from '../../../test/helpers';
import {
  match,
  resources,
} from './testResources';

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
  isSuppressFromDiscoveryEnabled: () => jest.fn(),
  history: {
    push: historyPushMock
  },
  location: {
    search: ''
  },
  mutator: {
    entitlements: {
      POST: noop
    }
  },
  match,
  resources:{ resources },
};

describe('AgreementLineCreateRoute', () => {
  describe('rendering the route', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineCreateRoute {...data} />
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
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });
  });
});
