import React from 'react';
import PropTypes from 'prop-types';

import FolioLink from '../FolioLink';
import { isExternal, urls } from '../utilities';

class EResourceLink extends React.Component {
  static propTypes = {
    eresource: PropTypes.shape({
      authority: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      reference: PropTypes.string,
    }).isRequired,
  }

  getName = (eresource) => {
    if (isExternal(eresource)) {
      return eresource.reference_object.label;
    }

    return eresource.name;
  }

  getPath = (eresource) => {
    const { authority, id, reference } = eresource;

    if (!authority && id) return urls.eresourceView(id);
    if (authority === 'EKB-PACKAGE') return urls.eholdingsPackageView(reference);
    if (authority === 'EKB-TITLE') return urls.eholdingsResourceView(reference);

    return undefined;
  }

  render() {
    const { eresource, ...rest } = this.props;

    const name = this.getName(eresource);
    const path = this.getPath(eresource);
    if (!path) return name;

    return (
      <FolioLink {...rest} path={this.getPath(eresource)}>
        {name}
      </FolioLink>
    );
  }
}

export default EResourceLink;
