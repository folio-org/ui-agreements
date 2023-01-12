import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';

import translationsProperties from '../../../test/helpers';
import UrlCustomizerCreateRoute from './UrlCustomizerCreateRoute';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};
const historyPushMock = jest.fn();

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
  match:{
    params: {
      agreementId: '',
      platformId: '082ef5fe-fac7-46ba-a37c-b636ae7aa266'
    }
  },
};

describe('UrlCustomizerCreateRoute', () => {
  describe('rendering the route', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerCreateRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the UrlCustomizerForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('UrlCustomizerForm')).toBeInTheDocument();
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
});
