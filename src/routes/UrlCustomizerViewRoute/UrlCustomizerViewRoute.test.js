import PropTypes from 'prop-types';

import { renderWithIntl, Button as ButtonInteractor } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import translationsProperties from '../../../test/helpers';
import UrlCustomizerViewRoute from './UrlCustomizerViewRoute';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
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

const historyPushMock = jest.fn();

jest.mock('../../components/views/UrlCustomizer', () => {
  return (props) => (
    <div>
      <div>UrlCustomizer</div>
      <CloseButton {...props} />
      <EditButton {...props} />
    </div>
  );
});

const routeProps = {
  history: {
    push: historyPushMock,
  },
  location: {
    search: ''
  },
  match: {
    params: {
      templateId: '',
      platformId: ''
    }
  },
};

describe('UrlCustomizerViewRoute', () => {
  describe('rendering the UrlCustomizerViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerViewRoute {...routeProps} />
        </MemoryRouter>,
        translationsProperties,
      );
    });

    test('renders the UrlCustomizer component', () => {
      const { getByText } = renderComponent;
      expect(getByText('UrlCustomizer')).toBeInTheDocument();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('renders the CloseButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the EditButton callback', async () => {
      await ButtonInteractor('EditButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('renders the EditButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('EditButton')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => {
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <UrlCustomizerViewRoute {...routeProps} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the UrlCustomizer component', () => {
        const { getByText } = renderComponent;
        expect(getByText('UrlCustomizer')).toBeInTheDocument();
      });
    });
  });
});
