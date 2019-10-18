import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';

import IfEResourcesEnabled from './components/IfEResourcesEnabled';
import OpenBasketButton from './components/OpenBasketButton';

import AgreementsRoute from './routes/AgreementsRoute';
import AgreementCreateRoute from './routes/AgreementCreateRoute';
import AgreementEditRoute from './routes/AgreementEditRoute';
import AgreementViewRoute from './routes/AgreementViewRoute';
import BasketRoute from './routes/BasketRoute';
import EResourcesRoute from './routes/EResourcesRoute';
import NoteCreateRoute from './routes/NoteCreateRoute';
import NoteEditRoute from './routes/NoteEditRoute';
import NoteViewRoute from './routes/NoteViewRoute';

import Settings from './settings';

import css from './index.css';
import EResourceViewRoute from './routes/EResourceViewRoute';

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    const { match: { path } } = this.props;

    return (
      <div className={css.container}>
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
      </div>
    );
  }
}

export default App;
export { default as Agreements } from './components/views/Agreements';
