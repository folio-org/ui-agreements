import PropTypes from 'prop-types';

import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';

import translationsProperties from '../../../test/helpers';
import EResourceViewRoute from './EResourceViewRoute';
import {
  entitlementOptions,
  entitlements,
  entitlementsCount,
  eresource,
  handlers,
  match,
  packageContents,
  packageContentsFilter,
  query,
  settings,
  tagsEnabled
} from './testResources';

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

const ActionsButton = () => {
  return <Button onClick={() => jest.fn()}>Actions</Button>;
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
      <ActionsButton {...props} />
    </div>
  );
});

const data = {
  handlers,
  isSuppressFromDiscoveryEnabled: () => { },
  history: {
    push: historyPushMock,
  },
  location: {
    pathname: '',
    search: ''
  },
  match,
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
      const { getAllByText } = renderComponent;
      const eresourceElements = getAllByText('EResource');
      expect(eresourceElements.length).toBeGreaterThan(0);
    });

    test('triggers the CloseButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('renders the CloseButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('CloseButton')).toBeInTheDocument();
    });

    test('triggers the EditButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('EditButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('renders the EditButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('EditButton')).toBeInTheDocument();
    });

    test('triggers the EResourceClickButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('EResourceClickButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('calls the EResourceClickButton callback', () => {
      const { getByText } = renderComponent;
      expect(getByText('EResourceClickButton')).toBeInTheDocument();
    });

    test('renders the NeedMoreEntitlementsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMoreEntitlementsButton')).toBeInTheDocument();
    });

    test('renders the NeedMoreEntitlementOptionsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMoreEntitlementOptionsButton')).toBeInTheDocument();
    });

    test('renders the NeedMorePackageContentsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMorePackageContentsButton')).toBeInTheDocument();
    });

    test('renders the FilterPackageContentsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('FilterPackageContentsButton')).toBeInTheDocument();
    });

    test('renders the ToggleTagsButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('ToggleTagsButton')).toBeInTheDocument();
    });

    test('renders the Actions button', () => {
      const { getByText } = renderComponent;
      expect(getByText('Actions')).toBeInTheDocument();
    });

    // TODO we should actually be _properly_ testing the useEffect, see AgreementsRoute example
    // using memory router to render with props which force it to call history.push mock and measuring that mock output
    /* describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
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
        const { getAllByText } = renderComponent;
        const eresourceElements = getAllByText('EResource');
        expect(eresourceElements.length).toBeGreaterThan(0);
      });
    }); */
  });
});
