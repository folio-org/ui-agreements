import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import {
  match,
  line,
  orderLines,
  query
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
  isSuppressFromDiscoveryEnabled: () => jest.fn(),
  history: {
    push: historyPushMock
  },
  location: {
    search: ''
  },
  mutator: {
    line: {
      GET: noop,
      reset: () => {},
    },
    mutator: {
      line: {
        GET: noop,
        reset: () => {},
      },
      orderLines: {
        GET: noop,
        reset: () => {},
      },
    },
  },
  resources: {
    line,
    query,
    orderLines,
  },
  match
};

describe('AgreementLineViewRoute', () => {
  let renderComponent;
  describe('rendering the route', () => {
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
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('triggers the EditButton callback', async () => {
      await ButtonInteractor('EditButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });
  });
});
