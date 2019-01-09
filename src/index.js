import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import ERM from './ERM';
import Settings from './settings';
import AgreementSearch from './routes/Agreements';

class UIAgreements extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.connectedERM = props.stripes.connect(ERM);
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedERM {...this.props} />}
        />
      </Switch>
    );
  }
}

export default UIAgreements;
export { AgreementSearch };
