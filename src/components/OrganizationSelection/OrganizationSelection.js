import React from 'react';
import PropTypes from 'prop-types';

import OrganizationSelectionContainer from './OrganizationSelectionContainer';

export default class OrganizationSelection extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
    }),
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedOrganizationSelectionContainer = props.stripes.connect(
      OrganizationSelectionContainer,
      { dataKey: props.input.name }
    );
  }

  render() {
    return <this.connectedOrganizationSelectionContainer {...this.props} />;
  }
}
