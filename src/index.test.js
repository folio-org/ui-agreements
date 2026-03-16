import { renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../test/helpers'; // adjust if needed
import App from './index';

let capturedRemoteKBProps;

// ---- Mock CSS + registry
jest.mock('./index.css', () => ({}));
jest.mock('./registry', () => jest.fn());

// ---- Mock routes/components we don't care about
jest.mock('./routes/AgreementsRoute', () => () => <div />);
jest.mock('./routes/AgreementCreateRoute/AgreementCreateRoute', () => () => <div />);
jest.mock('./routes/AgreementEditRoute', () => () => <div />);
jest.mock('./routes/AgreementViewRoute', () => () => <div />);
jest.mock('./routes/AgreementLinesRoute', () => () => <div />);
jest.mock('./routes/AgreementLineCreateRoute', () => () => <div />);
jest.mock('./routes/AgreementLineEditRoute', () => () => <div />);
jest.mock('./routes/AgreementLineViewRoute', () => () => <div />);
jest.mock('./routes/BasketRoute', () => () => <div />);
jest.mock('./routes/EResourceViewRoute', () => () => <div />);
jest.mock('./routes/EResourceEditRoute', () => () => <div />);
jest.mock('./routes/PackagesRoute', () => () => <div />);
jest.mock('./routes/NoteCreateRoute', () => () => <div />);
jest.mock('./routes/NoteEditRoute', () => () => <div />);
jest.mock('./routes/NoteViewRoute', () => () => <div />);
jest.mock('./routes/PlatformsRoute', () => () => <div />);
jest.mock('./routes/PlatformViewRoute', () => () => <div />);
jest.mock('./routes/PlatformEditRoute', () => () => <div />);
jest.mock('./routes/TitlesRoute', () => () => <div />);
jest.mock('./routes/UrlCustomizerEditRoute', () => () => <div />);
jest.mock('./routes/UrlCustomizerViewRoute', () => () => <div />);
jest.mock('./routes/UrlCustomizerCreateRoute', () => () => <div />);

jest.mock('./components/views/Agreements', () => () => <div />);
jest.mock('./components/IfEResourcesEnabled', () => ({ children }) => <>{children}</>);
jest.mock('./components/OpenBasketButton', () => () => <div />);

jest.mock('./RemoteKB/RemoteKBRoute', () => (props) => {
  capturedRemoteKBProps = props;
  return <div>RemoteKBRoute</div>;
});

// ---- Hooks (this is the new code you added)
const mockUseEresourcesEnabled = jest.fn();
const mockUseExternalKbInfo = jest.fn();


jest.mock('./hooks', () => ({
  useEresourcesEnabled: () => mockUseEresourcesEnabled(),
  useExternalKbInfo: () => mockUseExternalKbInfo(),
}));

// ---- Keep router simple
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Switch: ({ children }) => <div>{children}</div>,
}));

// ---- Minimal Stripes UI shells
jest.mock('@folio/stripes/components', () => ({
  Button: ({ children, to }) => <a href={to}>{children}</a>,
  ButtonGroup: ({ children }) => <div>{children}</div>,
  CommandList: ({ children }) => <div>{children}</div>,
  HasCommand: ({ children }) => <div>{children}</div>,
  KeyboardShortcutsModal: () => <div />,
  Layout: ({ children }) => <div>{children}</div>,
  NavList: ({ children }) => <div>{children}</div>,
  NavListItem: ({ children }) => <div>{children}</div>,
  NavListSection: ({ children }) => <div>{children}</div>,
  checkScope: jest.fn(),
  defaultKeyboardShortcuts: [],
}));

// ---- Route mock that *executes the render prop* so we can cover the branches
jest.mock('@folio/stripes/core', () => {
  const actual = jest.requireActual('@folio/stripes/core');

  return {
    ...actual, // ✅ keeps ModuleHierarchyContext + useModuleHierarchy etc
    AppContextMenu: ({ children }) => <div>{children(() => { })}</div>,
    IfPermission: ({ children }) => children({ hasPermission: false }),
    Route: ({ render, component: Component }) => {
      if (typeof render === 'function') {
        return <>{render({})}</>;
      }
      if (Component) return <Component />;
      return null;
    },
  };
});


const baseProps = (overrides = {}) => ({
  actAs: 'app',
  history: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  location: { pathname: '/erm/gokb' },
  match: { path: '/erm' },
  stripes: { home: '/home' },
  ...overrides,
});

describe('src/index new RemoteKB integration', () => {
  beforeEach(() => {
    capturedRemoteKBProps = undefined;
    mockUseEresourcesEnabled.mockReset();
    mockUseExternalKbInfo.mockReset();
  });

  test('shows GOKB tab button when externalKbInfo.kbCount > 0', () => {
    mockUseEresourcesEnabled.mockReturnValue(true);
    mockUseExternalKbInfo.mockReturnValue({ isLoading: false, kbCount: 2 });

    const { getByRole } = renderWithIntl(
      <App {...baseProps({ location: { pathname: '/erm/packages' } })} />,
      translationsProperties
    );

    // Button mock renders <a href="...">...</a>
    const gokbLink = getByRole('link', { name: /gokb/i });
    expect(gokbLink).toHaveAttribute('href', '/erm/gokb');
  });

  test('gokb route render returns null when externalKbInfo.isLoading is true', () => {
    mockUseEresourcesEnabled.mockReturnValue(true);
    mockUseExternalKbInfo.mockReturnValue({ isLoading: true, kbCount: 2 });

    const props = baseProps();
    const { queryByText } = renderWithIntl(<App {...props} />, translationsProperties);

    expect(queryByText('RemoteKBRoute')).not.toBeInTheDocument();
    expect(props.history.replace).not.toHaveBeenCalled();
  });

  test('gokb route render redirects to packages when kbCount is 0', () => {
    mockUseEresourcesEnabled.mockReturnValue(true);
    mockUseExternalKbInfo.mockReturnValue({ isLoading: false, kbCount: 0 });

    const props = baseProps();
    renderWithIntl(<App {...props} />, translationsProperties);

    expect(props.history.replace).toHaveBeenCalledWith('/erm/packages');
    expect(capturedRemoteKBProps).toBeUndefined();
  });

  test('gokb route render renders RemoteKBRoute with externalKbInfo when kbCount > 0', () => {
    const externalKbInfo = { isLoading: false, kbCount: 2, kbName: 'gokb', baseOrigin: 'x' };

    mockUseEresourcesEnabled.mockReturnValue(true);
    mockUseExternalKbInfo.mockReturnValue(externalKbInfo);

    const { getByText } = renderWithIntl(<App {...baseProps()} />, translationsProperties);

    expect(getByText('RemoteKBRoute')).toBeInTheDocument();
    expect(capturedRemoteKBProps.externalKbInfo).toEqual(externalKbInfo);
  });
});
