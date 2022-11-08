import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import { proxyServers, platform, stringTemplates } from './testResources';
import translationsProperties from '../../../test/helpers';
import PlatformViewRoute from './PlatformViewRoute';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
};

const ViewUrlCustomizerButton = (props) => {
  return <Button onClick={props.handlers.onViewUrlCustomizer}>ViewUrlCustomizerButton</Button>;
};

const ClickProxyServerActionButton = (props) => {
  return <Button onClick={props.handlers.onClickProxyServerAction}>ClickProxyServerActionButton</Button>;
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

ViewUrlCustomizerButton.propTypes = {
  handlers: PropTypes.shape({
    onViewUrlCustomizer: PropTypes.func,
  }),
};

ClickProxyServerActionButton.propTypes = {
  handlers: PropTypes.shape({
    onClickProxyServerAction: PropTypes.func,
  }),
};

const historyPushMock = jest.fn();
jest.mock('../../components/views/Platform', () => {
  return (props) => (
    <div>
      <div>Platform</div>
      <CloseButton {...props} />
      <EditButton {...props} />
      <ViewUrlCustomizerButton {...props} />
      <ClickProxyServerActionButton {...props} />
    </div>
  );
});

const props = {
  history:{
    push: historyPushMock,
  },
  location: {
    search: ''
  },
  match:{
    params:{
      id:''
    }
  },
  resources: {
    proxyServers,
    platform,
    stringTemplates
  },
};

describe('PlatformViewRoute', () => {
  describe('renders the PlatformViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <PlatformViewRoute {...props} />
        </MemoryRouter>,
        translationsProperties,
      );
    });

    test('renders the Platform component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Platform')).toBeInTheDocument();
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

    test('triggers the ViewUrlCustomizerButton callback', async () => {
      await ButtonInteractor('ViewUrlCustomizerButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the ViewUrlCustomizerButton callback', () => {
      const { getByText } = renderComponent;
      expect(getByText('ViewUrlCustomizerButton')).toBeInTheDocument();
    });

    test('renders the ClickProxyServerActionButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('ClickProxyServerActionButton')).toBeInTheDocument();
    });
  });
});
