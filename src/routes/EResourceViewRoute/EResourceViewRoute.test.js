import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import {
  entitlements,
  entitlementsCount,
  entitlementOptions,
  eresource,
  packageContents,
  packageContentsFilter,
  query,
  settings,
  handlers,
  match,
  tagsEnabled
} from './testResources';
import translationsProperties from '../../../test/helpers';
import EResourceViewRoute from './EResourceViewRoute';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
};

const EResourceClickButton = (props) => {
  return <Button onClick={props.handlers.onEResourceClick}>EResourceClickButton</Button>;
};

const NeedMoreEntitlementsButton = (props) => {
  return <Button onClick={props.handlers.onNeedMoreEntitlements}>NeedMoreEntitlementsButton</Button>;
};

const NeedMoreEntitlementOptionsButton = (props) => {
  return <Button onClick={props.handlers.onNeedMoreEntitlementOptions}>NeedMoreEntitlementOptionsButton</Button>;
};

const NeedMorePackageContentsButton = (props) => {
  return <Button onClick={props.handlers.onNeedMorePackageContents}>NeedMorePackageContentsButton</Button>;
};

const FilterPackageContentsButton = (props) => {
  return <Button onClick={props.handlers.onFilterPackageContents}>FilterPackageContentsButton</Button>;
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

EResourceClickButton.propTypes = {
  handlers: PropTypes.shape({
    onEResourceClick: PropTypes.func,
  }),
};

NeedMoreEntitlementsButton.propTypes = {
  handlers: PropTypes.shape({
    onNeedMoreEntitlements: PropTypes.func,
  }),
};

NeedMoreEntitlementOptionsButton.propTypes = {
  handlers: PropTypes.shape({
    onNeedMoreEntitlementOptions: PropTypes.func,
  }),
};

NeedMorePackageContentsButton.propTypes = {
  handlers: PropTypes.shape({
    onNeedMorePackageContents: PropTypes.func,
  }),
};

FilterPackageContentsButton.propTypes = {
  handlers: PropTypes.shape({
    onFilterPackageContents: PropTypes.func,
  }),
};

ToggleTagsButton.propTypes = {
  handlers: PropTypes.shape({
    onToggleTags: PropTypes.func,
  }),
};

const historyPushMock = jest.fn();
const mutatorEntitlementsCountMock = jest.fn();
const mutatorEntitlementsOffsetMock = jest.fn();
const mutatorQueryUpdateMock = jest.fn();
const mutatorEntitlementOptionsOffsetMock = jest.fn();
const mutatorPackageContentsCountMock = jest.fn();
const mutatorPackageContentsOffsetMock = jest.fn();
const mutatorPackageContentsFilterMock = jest.fn();

jest.mock('../../components/views/EResource', () => {
  return (props) => (
    <div>
      <div>EResource</div>
      <CloseButton {...props} />
      <EditButton {...props} />
      <EResourceClickButton {...props} />
      <NeedMoreEntitlementsButton {...props} />
      <NeedMoreEntitlementOptionsButton {...props} />
      <NeedMorePackageContentsButton {...props} />
      <FilterPackageContentsButton {...props} />
      <ToggleTagsButton {...props} />
    </div>
  );
});

const data = {
  handlers,
  isSuppressFromDiscoveryEnabled: () => {},
  history:{
    push: historyPushMock,
  },
  location: {
    search: ''
  },
  match,
  mutator:{
    entitlementsCount:{
      replace: mutatorEntitlementsCountMock,
    },
    entitlementsOffset:{
      replace: mutatorEntitlementsOffsetMock,
    },
    entitlementOptionsOffset:{
      replace: mutatorEntitlementOptionsOffsetMock,
    },
    packageContentsCount:{
      replace: mutatorPackageContentsCountMock,
    },
    packageContentsOffset:{
      replace: mutatorPackageContentsOffsetMock,
    },
    packageContentsFilter:{
      replace: mutatorPackageContentsFilterMock,
    },
    query:{
      update: mutatorQueryUpdateMock,
    }
  },
  resources: {
    entitlements,
    entitlementsCount,
    entitlementOptions,
    eresource,
    packageContents,
    packageContentsFilter,
    query,
    settings
  },
  tagsEnabled
};

describe('EResourceViewRoute', () => {
  describe('rendering the EResourceViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourceViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties,
      );
    });

    test('renders the EResource component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EResource')).toBeInTheDocument();
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

    test('triggers the EResourceClickButton callback', async () => {
      await ButtonInteractor('EResourceClickButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the EResourceClickButton callback', () => {
    const { getByText } = renderComponent;
    expect(getByText('EResourceClickButton')).toBeInTheDocument();
    });

    test('triggers the NeedMoreEntitlementsButton callback', async () => {
      await ButtonInteractor('NeedMoreEntitlementsButton').click();
      expect(mutatorEntitlementsOffsetMock).toHaveBeenCalled();
    });

    test('renders the NeedMoreEntitlementsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMoreEntitlementsButton')).toBeInTheDocument();
    });

    test('calls the NeedMoreEntitlementOptionsButton callback', async () => {
      await ButtonInteractor('NeedMoreEntitlementOptionsButton').click();
      expect(mutatorEntitlementOptionsOffsetMock).toHaveBeenCalled();
    });

    test('renders the NeedMoreEntitlementOptionsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMoreEntitlementOptionsButton')).toBeInTheDocument();
    });

    test('triggers the NeedMorePackageContentsButton callback', async () => {
      await ButtonInteractor('NeedMorePackageContentsButton').click();
      expect(mutatorPackageContentsOffsetMock).toHaveBeenCalled();
    });

    test('renders the NeedMorePackageContentsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMorePackageContentsButton')).toBeInTheDocument();
    });

    test('triggers the FilterPackageContentsButton callback', async () => {
      await ButtonInteractor('FilterPackageContentsButton').click();
      expect(mutatorPackageContentsFilterMock).toHaveBeenCalled();
    });

    test('renders the FilterPackageContentsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('FilterPackageContentsButton')).toBeInTheDocument();
    });

    test('triggers the ToggleTagsButton callback', async () => {
      await ButtonInteractor('ToggleTagsButton').click();
      expect(mutatorQueryUpdateMock).toHaveBeenCalled();
    });

    test('renders the ToggleTagsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('ToggleTagsButton')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <EResourceViewRoute {...data} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the EResource component', () => {
        const { getByText } = renderComponent;
        expect(getByText('EResource')).toBeInTheDocument();
      });
    });
  });
});
