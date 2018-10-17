import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Layout } from '@folio/stripes/components';

import OpenBasketButton from './components/OpenBasketButton';
import Dashboard from './routes/Dashboard';
import Agreements from './routes/Agreements';
import EResources from './routes/EResources';
import Tabs from './components/Tabs';

import css from './ERM.css';

const INITIAL_RESULT_COUNT = 100;

export default class Erm extends React.Component {
  static manifest = Object.freeze({
    query: {},
    resultCount: { initialValue: INITIAL_RESULT_COUNT }
  });

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedOpenBasketButton = props.stripes.connect(OpenBasketButton);
    this.connectedDashboard = props.stripes.connect(Dashboard);
    this.connectedAgreements = props.stripes.connect(Agreements);
    this.connectedEResources = props.stripes.connect(EResources);
  }

  getCurrentPage(props) {
    const { match, location } = props;
    const lStripped = location.pathname.substring(match.path.length + 1);
    const rStripped = lStripped.split('/')[0];

    return rStripped;
  }

  render() {
    const { stripes, match } = this.props;
    const currentPage = this.getCurrentPage(this.props);

    return (
      <React.Fragment>
        <Layout className={`${css.header} display-flex full padding-top-gutter padding-start-gutter padding-end-gutter`}>
          <Tabs
            tab={currentPage}
            parentResources={this.props.resources}
            parentMutator={this.props.mutator}
          />
          <this.connectedOpenBasketButton stripes={stripes} />
        </Layout>
        <Switch>
          <Route
            path={`${match.path}/dashboard`}
            render={() => <this.connectedDashboard stripes={stripes} />}
          />
          <Route
            path={`${match.path}/agreements`}
            render={() => <this.connectedAgreements stripes={stripes} />}
          />
          <Route
            path={`${match.path}/eresources`}
            render={() => <this.connectedEResources stripes={stripes} />}
          />
          <Redirect
            exact
            from={`${match.path}`}
            to={`${match.path}/dashboard`}
          />
        </Switch>
      </React.Fragment>
    );
  }
}
