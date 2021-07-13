import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { AppContextMenu, Route } from '@folio/stripes/core';
import {
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

import css from './index.css';
import setUpRegistry from './setUpRegistry';

import AgreementsRoute from './routes/AgreementsRoute';
import AgreementCreateRoute from './routes/AgreementCreateRoute';
import AgreementEditRoute from './routes/AgreementEditRoute';
import AgreementViewRoute from './routes/AgreementViewRoute';

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

import UrlCustomizerEditRoute from './routes/UrlCustomizerEditRoute';
import UrlCustomizerViewRoute from './routes/UrlCustomizerViewRoute';
import UrlCustomizerCreateRoute from './routes/UrlCustomizerCreateRoute';

import IfEResourcesEnabled from './components/IfEResourcesEnabled';
import OpenBasketButton from './components/OpenBasketButton';

import Settings from './Settings';

class App extends React.Component {
  static eventHandler(event, _s, data) {
    if (event === 'ui-stripes-registry-load') {
      // Data should contain Registry singleton:
      setUpRegistry(data);
    }

    return null;
  }

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
    match: PropTypes.object.isRequired,
    actAs: PropTypes.string.isRequired,
    stripes: PropTypes.object.isRequired,
  }

  state = {
    showKeyboardShortcutsModal: false,
  };

  changeKeyboardShortcutsModal = (modalState) => {
    this.setState({ showKeyboardShortcutsModal: modalState });
  };

  shortcutModalToggle(handleToggle) {
    handleToggle();
    this.changeKeyboardShortcutsModal(true);
  }

  searchInput = () => {
    const { pathname } = this.props.location;

    if (pathname.search('/erm/agreements') === 0) {
      return 'input-agreement-search';
    } else if (pathname.search('/erm/eresources') === 0) {
      return 'input-eresource-search';
    } else if (pathname.search('/erm/platforms') === 0) {
      return 'input-platform-search';
    } else {
      return undefined;
    }
  }

  focusSearchField = () => {
    const { history, stripes } = this.props;
    const el = document.getElementById(this.searchInput());
    if (el) {
      el.focus();
    } else {
      history.push(stripes.home);
    }
  }

  shortcuts = [
    {
      name: 'search',
      handler: this.focusSearchField
    },
    {
      name: 'openShortcutModal',
      handler: this.changeKeyboardShortcutsModal
    },
  ];

  render() {
    const { actAs, match: { path } } = this.props;

    if (actAs === 'settings') {
      return <Settings {...this.props} />
    }

    return (
      <>
        <CommandList commands={defaultKeyboardShortcuts}>
          <HasCommand
            commands={this.shortcuts}
            isWithinScope={checkScope}
            scope={document.body}
          >
            <AppContextMenu>
              {(handleToggle) => (
                <NavList>
                  <NavListSection>
                    <NavListItem
                      id="keyboard-shortcuts-item"
                      onClick={() => { this.shortcutModalToggle(handleToggle); }}
                    >
                      <FormattedMessage id="ui-agreements.appMenu.keyboardShortcuts" />
                    </NavListItem>
                  </NavListSection>
                </NavList>
              )}
            </AppContextMenu>
            <div className={css.container}>
                <IfEResourcesEnabled>
                  <Layout className={`${css.header} display-flex justify-end full padding-top-gutter padding-start-gutter padding-end-gutter`}>
                    <OpenBasketButton />
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

                    <Route component={EResourceEditRoute} path={`${path}/eresources/:id/edit`} />
                    <Route component={EResourcesRoute} path={`${path}/eresources/:id?`}>
                        <Route component={EResourceViewRoute} path={`${path}/eresources/:id`} />
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
        { this.state.showKeyboardShortcutsModal && (
        <KeyboardShortcutsModal
          allCommands={defaultKeyboardShortcuts}
          onClose={() => { this.changeKeyboardShortcutsModal(false); }}
          open
        />
      )}
      </>
    );
  }
}

export default App;
export { default as Agreements } from './components/views/Agreements';
