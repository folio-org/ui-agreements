import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';
import FolioLink from '../FolioLink';

class EResourceLink extends React.Component {
  static propTypes = {
    eresource: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);

    this.connectedFolioLink = props.stripes.connect(FolioLink);
  }

  render() {
    const { eresource: { id, name }, ...rest } = this.props;

    if (!id) return name;

    return (
      <this.connectedFolioLink {...rest} path={`/erm/eresources/view/${id}`}>
        {name}
      </this.connectedFolioLink>
    );
  }
}

export default withStripes(EResourceLink);
