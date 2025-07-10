import PropTypes from 'prop-types';

import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  Button as ButtonInteractor,
  Callout,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
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
  tagsEnabled,
} from './testResources';

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
};

const EResourceClickButton = (props) => {
  return (
    <Button onClick={props.handlers.onEResourceClick}>
      EResourceClickButton
    </Button>
  );
};

const NeedMoreEntitlementsButton = (props) => {
  return (
    <Button onClick={props.handlers.onNeedMoreEntitlements}>
      NeedMoreEntitlementsButton
    </Button>
  );
};

const NeedMoreEntitlementOptionsButton = (props) => {
  return (
    <Button onClick={props.handlers.onNeedMoreEntitlementOptions}>
      NeedMoreEntitlementOptionsButton
    </Button>
  );
};

const NeedMorePackageContentsButton = (props) => {
  return (
    <Button onClick={props.handlers.onNeedMorePackageContents}>
      NeedMorePackageContentsButton
    </Button>
  );
};

const FilterPackageContentsButton = (props) => {
  return (
    <Button onClick={props.handlers.onFilterPackageContents}>
      FilterPackageContentsButton
    </Button>
  );
};

const ToggleTagsButton = (props) => {
  return (
    <Button onClick={props.handlers.onToggleTags}>ToggleTagsButton</Button>
  );
};

const SynchronizeButton = (props) => {
  return (
    <Button onClick={() => props.handlers.onSynchronize('SYNCHRONIZING')}>
      SynchronizeButton
    </Button>
  );
};

const PauseButton = (props) => {
  return (
    <Button onClick={() => props.handlers.onSynchronize('PAUSED')}>
      PauseButton
    </Button>
  );
};

const DeleteDryRunButton = (props) => (
  <Button onClick={props.handlers.onDeleteDryRun}>DeleteDryRunButton</Button>
);

const DeleteButton = (props) => (
  <Button onClick={props.handlers.onDelete}>DeleteButton</Button>
);

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

SynchronizeButton.propTypes = {
  handlers: PropTypes.shape({
    onSynchronize: PropTypes.func,
  }),
};

PauseButton.propTypes = {
  handlers: PropTypes.shape({
    onSynchronize: PropTypes.func,
  }),
};

DeleteDryRunButton.propTypes = {
  handlers: PropTypes.shape({
    onDeleteDryRun: PropTypes.func,
  }),
};

DeleteButton.propTypes = {
  handlers: PropTypes.shape({
    onDelete: PropTypes.func,
  }),
};

const historyPushMock = jest.fn();

// Due to the fact that we have a callout containing a link component as part of the handleDelete
// This causes an issue in which the Link component is rendered outside the MemoryRouter, causing the test to fail.
// A solution to this would be to add a harness level router to the CalloutHarness component whilst wiring up props etc.
// However, for now, we can mock the Link component to avoid this issue in our tests
// Intorduction of the Link mock is to replace the Link component with a simple span which wont throw an error
// If this issue shows up a handleful more tiome, this should be revisited and the router at the callout harness level implemented
jest.mock('react-router-dom', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
    ...jest.requireActual('react-router-dom'),
    Link: forwardRef((props, ref) => (
      <span ref={ref}>Link {props.to ? `to: ${props.to}` : ''}</span>
    )),
  };
});

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
      <SynchronizeButton {...props} />
      <PauseButton {...props} />
      <DeleteDryRunButton {...props} />
      <DeleteButton {...props} />
    </div>
  );
});

const data = {
  handlers: {
    ...handlers,
  },
  isSuppressFromDiscoveryEnabled: () => {},
  history: {
    push: historyPushMock,
  },
  location: {
    pathname: '',
    search: '',
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
    settings,
  },
  tagsEnabled,
};

describe('EResourceViewRoute', () => {
  describe('rendering the EResourceViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResourceViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties
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

    test('renders the SynchronizeButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('SynchronizeButton')).toBeInTheDocument();
    });

    test('renders the PauseButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('PauseButton')).toBeInTheDocument();
    });

    test('renders the DeleteDryRunButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('DeleteDryRunButton')).toBeInTheDocument();
    });

    test('triggers the DeleteDryRunButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('DeleteDryRunButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('renders the DeleteButton button', () => {
      const { getByText } = renderComponent;
      expect(getByText('DeleteButton')).toBeInTheDocument();
    });

    // The offending test requiring the Link mock
    test('triggers the DeleteButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('DeleteButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    describe('clicking start synchronisation', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await ButtonInteractor('SynchronizeButton').click();
        });
      });

      test('synchronise callout fires', async () => {
        await waitFor(async () => {
          await Callout(/Package: .* will synchronise/i).exists();
        });
      });
    });

    describe('clicking pause synchronisation', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await ButtonInteractor('PauseButton').click();
        });
      });

      test('pause callout fires', async () => {
        await waitFor(async () => {
          await Callout(/Package: .* has been paused/i).exists();
        });
      });
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
