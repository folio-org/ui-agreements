import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

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
    const { authority, reference } = eresource;

    if (authority === 'EKB-PACKAGE') return urls.eholdingsPackageView(reference);
    if (authority === 'EKB-TITLE') return urls.eholdingsResourceView(reference);

    let { id } = eresource;

    if (eresource.class === 'org.olf.kb.PackageContentItem') {
      // We don't really want to show an URL to the item itself,
      // we want the eresource/title that the PCI is referring to.
      id = get(eresource, '_object.pti.titleInstance.id');
    }

    return id ? urls.eresourceView(id) : undefined;
  }

  render() {
    const { eresource, ...rest } = this.props;

    const name = this.getName(eresource);
    const path = this.getPath(eresource);
    if (!path) return name || '-';

    return (
      <div data-test-eresource-name>
        <FolioLink {...rest} path={this.getPath(eresource)}>
          {name}
        </FolioLink>
      </div>
    );
  }
}

export default EResourceLink;
