import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';

import css from './index.css';

const AgreementsRoute = lazy(() => import('./routes/AgreementsRoute'));
const AgreementCreateRoute = lazy(() => import('./routes/AgreementCreateRoute'));
const AgreementEditRoute = lazy(() => import('./routes/AgreementEditRoute'));
const AgreementViewRoute = lazy(() => import('./routes/AgreementViewRoute'));

const BasketRoute = lazy(() => import('./routes/BasketRoute'));

const EResourcesRoute = lazy(() => import('./routes/EResourcesRoute'));
const EResourceViewRoute = lazy(() => import('./routes/EResourceViewRoute'));
const EResourceEditRoute = lazy(() => import('./routes/EResourceEditRoute'));

const NoteCreateRoute = lazy(() => import('./routes/NoteCreateRoute'));
const NoteEditRoute = lazy(() => import('./routes/NoteEditRoute'));
const NoteViewRoute = lazy(() => import('./routes/NoteViewRoute'));

const IfEResourcesEnabled = lazy(() => import('./components/IfEResourcesEnabled'));
const OpenBasketButton = lazy(() => import('./components/OpenBasketButton'));

const Settings = lazy(() => import('./settings'));

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.showSettings) {
      return (
        <Suspense fallback={null}>
          <Settings {...this.props} />
        </Suspense>
      );
    }

    const { match: { path } } = this.props;

    return (
      <div className={css.container}>
        <Suspense fallback={null}>
          <IfEResourcesEnabled>
            <Layout className={`${css.header} display-flex justify-end full padding-top-gutter padding-start-gutter padding-end-gutter`}>
              <OpenBasketButton />
            </Layout>
          </IfEResourcesEnabled>
          <div className={css.body}>
            <Switch>
              <Route component={AgreementCreateRoute} path={`${path}/agreements/create`} />
              <Route component={AgreementEditRoute} path={`${path}/agreements/:id/edit`} />
              <Route component={AgreementsRoute} path={`${path}/agreements/:id?`}>
                <Suspense fallback={null}>
                  <Route component={AgreementViewRoute} path={`${path}/agreements/:id`} />
                </Suspense>
              </Route>

              <Route component={EResourceEditRoute} path={`${path}/eresources/:id/edit`} />
              <Route component={EResourcesRoute} path={`${path}/eresources/:id?`}>
                <Suspense fallback={null}>
                  <Route component={EResourceViewRoute} path={`${path}/eresources/:id`} />
                </Suspense>
              </Route>

              <Route component={NoteCreateRoute} path={`${path}/notes/create`} />
              <Route component={NoteEditRoute} path={`${path}/notes/:id/edit`} />
              <Route component={NoteViewRoute} path={`${path}/notes/:id`} />

              <Route component={BasketRoute} path={`${path}/basket`} />
            </Switch>
          </div>
        </Suspense>
      </div>
    );
  }
}

export default App;
export { default as Agreements } from './components/views/Agreements';
