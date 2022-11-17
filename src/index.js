import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { AppContextMenu, IfPermission, Route } from '@folio/stripes/core';
import {
  Button,
  ButtonGroup,
  CommandList,
  HasCommand,
  KeyboardShortcutsModal,
  Layout,
  NavList,
  NavListItem,
  NavListSection,
  checkScope,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';

import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import css from './index.css';
import setUpRegistry from './setUpRegistry';

import AgreementsRoute from './routes/AgreementsRoute';
import AgreementCreateRoute from './routes/AgreementCreateRoute/AgreementCreateRoute';
import AgreementEditRoute from './routes/AgreementEditRoute';
import AgreementViewRoute from './routes/AgreementViewRoute';

import AgreementLinesRoute from './routes/AgreementLinesRoute';
import AgreementLineCreateRoute from './routes/AgreementLineCreateRoute';
import AgreementLineEditRoute from './routes/AgreementLineEditRoute';
import AgreementLineViewRoute from './routes/AgreementLineViewRoute';

import BasketRoute from './routes/BasketRoute';

import EResourcesRoute from './routes/EResourcesRoute';
import EResourceViewRoute from './routes/EResourceViewRoute';
import EResourceEditRoute from './routes/EResourceEditRoute';

import NoteCreateRoute from './routes/NoteCreateRoute';
import NoteEditRoute from './routes/NoteEditRoute';
import NoteViewRoute from './routes/NoteViewRoute';

import PlatformsRoute from './routes/PlatformsRoute';
import PlatformViewRoute from './routes/PlatformViewRoute';
import PlatformEditRoute from './routes/PlatformEditRoute';

import TitlesRoute from './routes/TitlesRoute';

import UrlCustomizerEditRoute from './routes/UrlCustomizerEditRoute';
import UrlCustomizerViewRoute from './routes/UrlCustomizerViewRoute';
import UrlCustomizerCreateRoute from './routes/UrlCustomizerCreateRoute';

import IfEResourcesEnabled from './components/IfEResourcesEnabled';
import OpenBasketButton from './components/OpenBasketButton';

import Settings from './settings';
import { useEresourcesEnabled } from './hooks';

const App = (props) => {
  // Destructure important props
  const {
    actAs,
    history,
    location: { pathname },
    match: { path },
    stripes
  } = props;

  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

  const addKey = useIntlKeyStore(state => state.addKey);
  addKey('ui-agreements');

  const eresourcesEnabled = useEresourcesEnabled();

  const shortcutModalToggle = (handleToggle) => {
    handleToggle();
    setShowKeyboardShortcutsModal(true);
  };

  const searchInput = () => {
    if (pathname.search('/erm/agreements') === 0) {
      return 'input-agreement-search';
    } else if (pathname.search('/erm/eresources') === 0) {
      return 'input-eresource-search';
    } else if (pathname.search('/erm/platforms') === 0) {
      return 'input-platform-search';
    } else if (pathname.search('/erm/agreementLines') === 0) {
      return 'input-agreementLine-search';
    } else {
      return undefined;
    }
  };

  const focusSearchField = () => {
    const el = document.getElementById(searchInput());
    if (el) {
      el.focus();
    } else {
      history.push(stripes.home);
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: focusSearchField
    },
    {
      name: 'openShortcutModal',
      handler: setShowKeyboardShortcutsModal
    },
  ];

  if (actAs === 'settings') {
    return <Settings {...props} />;
  }

  const renderTabGroup = () => {
    // If local KB is enabled, display a tab group to switch between agreements/agreementLines and ereosurces/platforms
    if (eresourcesEnabled) {
      return (
        <ButtonGroup>
          <Button
            buttonStyle={
              (pathname?.startsWith('/erm/agreements') ||
              pathname?.startsWith('/erm/agreementLines')) ?
                'primary' :
                'default'
            }
            to="/erm/agreements"
          >
            <FormattedMessage id="ui-agreements.agreementsSearch" />
          </Button>
          <Button
            buttonStyle={
              (pathname?.startsWith('/erm/eresources') ||
              pathname?.startsWith('/erm/titles') ||
              pathname?.startsWith('/erm/platforms')) ?
                'primary' :
                'default'
            }
            to="/erm/eresources"
          >
            <FormattedMessage id="ui-agreements.localKBSearch" />
          </Button>
        </ButtonGroup>
      );
    }

    // Otherwise render an empty div so that the spacing still works out as expected
    return <div />;
  };

  return (
    <>
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {(handleToggle) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => { shortcutModalToggle(handleToggle); }}
                  >
                    <FormattedMessage id="ui-agreements.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <div className={css.container}>
            <IfEResourcesEnabled>
              <Layout className={`${css.header} display-flex full padding-top-gutter padding-start-gutter padding-end-gutter`}>
                <div /> {/* Empty start item so we can get centre/end aligned */}
                {renderTabGroup()}
                <IfPermission perm="ui-agreements.agreements.edit">
                  {({ hasPermission }) => (hasPermission ?
                    <OpenBasketButton />
                    :
                    <div />
                  )}
                </IfPermission>
              </Layout>
            </IfEResourcesEnabled>
            <div className={css.body}>
              <Switch>
                <Route component={AgreementCreateRoute} path={`${path}/agreements/create`} />
                <Route component={AgreementEditRoute} path={`${path}/agreements/:id/edit`} />
                <Route component={AgreementLineCreateRoute} path={`${path}/agreements/:agreementId/line/create`} />
                <Route component={AgreementLineEditRoute} path={`${path}/agreements/:agreementId/line/:lineId/edit`} />
                <Route component={AgreementsRoute} path={`${path}/agreements/:id?`}>
                  <Switch>
                    <Route component={AgreementLineViewRoute} path={`${path}/agreements/:agreementId/line/:lineId`} />
                    <Route component={AgreementViewRoute} path={`${path}/agreements/:id`} />
                  </Switch>
                </Route>

                <Route component={AgreementLineEditRoute} path={`${path}/agreementLines/:lineId/agreement/:agreementId/edit`} />
                <Route component={AgreementLinesRoute} path={`${path}/agreementLines/:id?`}>
                  <Route component={AgreementLineViewRoute} path={`${path}/agreementLines/:lineId/agreement/:agreementId`} />
                </Route>

                <Route component={EResourceEditRoute} path={`${path}/eresources/:id/edit`} />
                <Route component={EResourcesRoute} path={`${path}/eresources/:id?`}>
                  <Route component={EResourceViewRoute} path={`${path}/eresources/:id`} />
                </Route>

                <Route component={TitlesRoute} path={`${path}/titles/:id?`}>
                  <Route component={EResourceViewRoute} path={`${path}/titles/:id`} />
                </Route>

                <Route component={NoteCreateRoute} path={`${path}/notes/create`} />
                <Route component={NoteEditRoute} path={`${path}/notes/:id/edit`} />
                <Route component={NoteViewRoute} path={`${path}/notes/:id`} />

                <Route component={PlatformEditRoute} path={`${path}/platforms/:id/edit`} />
                <Route component={UrlCustomizerCreateRoute} path={`${path}/platforms/:platformId/urlcustomizer/create`} />
                <Route component={UrlCustomizerEditRoute} path={`${path}/platforms/:platformId/urlcustomizer/:templateId/edit`} />
                <Route component={PlatformsRoute} path={`${path}/platforms/:id?`}>
                  <Switch>
                    <Route component={UrlCustomizerViewRoute} path={`${path}/platforms/:platformId/urlcustomizer/:templateId`} />
                    <Route component={PlatformViewRoute} path={`${path}/platforms/:id`} />
                  </Switch>
                </Route>

                <Route component={BasketRoute} path={`${path}/basket`} />
              </Switch>
            </div>
          </div>
        </HasCommand>
      </CommandList>
      {showKeyboardShortcutsModal && (
        <KeyboardShortcutsModal
          allCommands={defaultKeyboardShortcuts}
          onClose={() => { setShowKeyboardShortcutsModal(false); }}
          open
        />
      )}
    </>
  );
};

App.eventHandler = (event, _s, data) => {
  if (event === 'LOAD_STRIPES_REGISTRY') {
    // Data should contain Registry singleton:
    setUpRegistry(data);
  }

  return null;
};

App.propTypes = {
  history: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  match: PropTypes.object.isRequired,
  actAs: PropTypes.string.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default App;
export { default as Agreements } from './components/views/Agreements';
