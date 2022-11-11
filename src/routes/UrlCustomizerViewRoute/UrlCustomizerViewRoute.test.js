import PropTypes from 'prop-types';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import UrlCustomizerViewRoute from './UrlCustomizerViewRoute';

const urlCustomization = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [{
    'id': '8c195c10-086a-4c51-a7cb-d3e5d66b4042',
    'dateCreated': '2021-12-07T11:51:56Z',
    'rule': '1234',
    'context': {
      'id': '2c91809c7d929016017d92974eb90010',
      'value': 'urlcustomiser',
      'label': 'urlCustomiser'
    },
    'lastUpdated': '2021-12-07T11:51:56Z',
    'name': 'test',
    'idScopes': [
      '082ef5fe-fac7-46ba-a37c-b636ae7aa266'
    ]
  }],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Tue Dec 07 2021 13:16:36 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/sts/8c195c10-086a-4c51-a7cb-d3e5d66b4042',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'urlCustomization',
  'module': '@folio/agreements',
  'throwErrors': false
};

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
  mutator: {
    urlCustomization: {
      DELETE: () => {},
    }
  },
  resources: {
    urlCustomization
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
