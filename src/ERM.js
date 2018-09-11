import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import Dashboard from './routes/Dashboard';
import Agreements from './routes/Agreements';
import Titles from './routes/Titles';
import Tabs from './components/Tabs';

export default class Erm extends React.Component {
  static manifest = Object.freeze({ query: {} });

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

    // The `resources` object of a connected component is shared across the module
    // and since each of the following may specify a `records` on their manifest,
    // we give them each a separate `dataKey` to ensure their results don't collide.
    this.connectedDashboard = props.stripes.connect(Dashboard /*, { dataKey: 'dashboard' } */);
    this.connectedAgreements = props.stripes.connect(Agreements /*, { dataKey: 'agreements' } */);
    this.connectedTitles = props.stripes.connect(Titles /*, { dataKey: 'titles' } */);
  }

  render() {
    const { stripes, match, location, resources, mutator } = this.props;
    const currentPage = location.pathname.substring(match.path.length + 1);

    return (
      <React.Fragment>
        <Tabs
          tab={currentPage}
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
        />
        <Switch>
          <Route
            path={`${match.path}/dashboard`}
            render={() => <this.connectedDashboard resources={resources} mutator={mutator} stripes={stripes} />}
          />
          <Route
            path={`${match.path}/agreements`}
            render={() => <this.connectedAgreements resources={resources} mutator={mutator} stripes={stripes} />}
          />
          <Route
            path={`${match.path}/titles`}
            render={() => <this.connectedTitles resources={resources} mutator={mutator} stripes={stripes} />}
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
