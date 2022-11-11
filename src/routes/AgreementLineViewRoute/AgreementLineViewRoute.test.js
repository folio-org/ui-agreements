import PropTypes from 'prop-types';


import { useQuery } from 'react-query';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import {
  match,
  line,
} from './testResources';
import translationsProperties from '../../../test/helpers';
import AgreementLineViewRoute from './AgreementLineViewRoute';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
};

const ToggleTagsButton = (props) => {
  return <Button onClick={props.handlers.onToggleTags}>ToggleTagsButton</Button>;
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};

EditButton.propTypes = {
  handlers: PropTypes.shape({
    onEdit: PropTypes.func,
  }),
};

ToggleTagsButton.propTypes = {
  handlers: PropTypes.shape({
    onToggleTags: PropTypes.func,
  }),
};

const historyPushMock = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useSuppressFromDiscovery: jest.fn(() => () => true),
}));

jest.mock('../../components/views/AgreementLine', () => {
  return (props) => (
    <div>
      <div>AgreementLine</div>
      <CloseButton {...props} />
      <EditButton {...props} />
      <ToggleTagsButton {...props} />
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
  match
};

useQuery.mockImplementation(() => ({ data: line, isLoading: false }));

describe('AgreementLineViewRoute', () => {
  let renderComponent;
  describe('rendering the route from agreements', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the AgreementLine component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLine')).toBeInTheDocument();
    });

    test('renders the CloseButton ', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalledWith(`/erm/agreements/${match.params.agreementId}`);
    });

    test('triggers the EditButton callback', async () => {
      await ButtonInteractor('EditButton').click();
      expect(historyPushMock).toHaveBeenCalledWith(`/erm/agreements/${match.params.agreementId}/line/${match.params.lineId}/edit`);
    });
  });

  describe('rendering the route from agreementLines', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineViewRoute
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

    test('renders the AgreementLine component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLine')).toBeInTheDocument();
    });

    test('renders the CloseButton ', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalledWith('/erm/agreementLines');
    });

    test('triggers the EditButton callback', async () => {
      await ButtonInteractor('EditButton').click();
      expect(historyPushMock).toHaveBeenCalledWith(`/erm/agreementLines/${match.params.lineId}/agreement/${match.params.agreementId}/edit`);
    });
  });
});
