import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';
import { Layout, Spinner } from '@folio/stripes/components';

import css from './index.css';

const AgreementsRoute = lazy(() => import('./routes/AgreementsRoute'));
const AgreementCreateRoute = React.lazy(() => import('./routes/AgreementCreateRoute'));
const AgreementEditRoute = lazy(() => import('./routes/AgreementEditRoute'));
const AgreementViewRoute = lazy(() => import('./routes/AgreementViewRoute'));

const BasketRoute = lazy(() => import('./routes/BasketRoute'));

const EResourcesRoute = lazy(() => import('./routes/EResourcesRoute'));
const EResourceViewRoute = lazy(() => import('./routes/EResourceViewRoute'));

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
        <Suspense fallback={<Spinner />}>
          <Settings {...this.props} />
        </Suspense>
      );
    }

    const { match: { path } } = this.props;

    return (
      <div className={css.container}>
        <Suspense fallback={<Spinner />}>
          <IfEResourcesEnabled>
            <Layout className={`${css.header} display-flex justify-end full padding-top-gutter padding-start-gutter padding-end-gutter`}>
              <OpenBasketButton />
            </Layout>
          </IfEResourcesEnabled>
          <div className={css.body}>
            <Switch>
              <Route path={`${path}/agreements/create`} component={AgreementCreateRoute} />
              <Route path={`${path}/agreements/:id/edit`} component={AgreementEditRoute} />
              <Route path={`${path}/agreements/:id?`} component={AgreementsRoute}>
                <Route path={`${path}/agreements/:id`} component={AgreementViewRoute} />
              </Route>

              <Route path={`${path}/eresources/:id?`} component={EResourcesRoute}>
                <Route path={`${path}/eresources/:id`} component={EResourceViewRoute} />
              </Route>

              <Route path={`${path}/notes/create`} component={NoteCreateRoute} />
              <Route path={`${path}/notes/:id/edit`} component={NoteEditRoute} />
              <Route path={`${path}/notes/:id`} component={NoteViewRoute} />

              <Route path={`${path}/basket`} component={BasketRoute} />
            </Switch>
          </div>
        </Suspense>
      </div>
    );
  }
}

export default App;
export { default as Agreements } from './components/views/Agreements';
