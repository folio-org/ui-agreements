import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';
import { isExternal, urls } from '../utilities';
import { BASKET_TYPE_GOKB_TITLE, resourceClasses } from '../../constants';

class EResourceLink extends React.Component {
  static propTypes = {
    eresource: PropTypes.shape({
      authority: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      reference: PropTypes.string,
    }).isRequired,
    searchString: PropTypes.string,
  }

  getName = (eresource) => {
    if (isExternal(eresource)) {
      return eresource?.reference_object?.label ?? eresource?.resourceName;
    }

    const pti = eresource?._object?.pti ?? eresource?.pti;
    const name = pti?.titleInstance?.name ?? eresource.name;

    return name;
  }

  getPath = (eresource) => {
    const { authority, reference, type } = eresource;

    if (authority === 'EKB-PACKAGE') return urls.eholdingsPackageView(reference);
    if (authority === 'EKB-TITLE') return urls.eholdingsResourceView(reference);

    if (type === BASKET_TYPE_GOKB_TITLE) {
      return urls.gokbResourceView(eresource.id);
    }

    const pti = eresource?._object?.pti ?? eresource?.pti;
    const id = pti?.titleInstance?.id ?? eresource.id;

    if (id) {
      // Only redirect to package lookup for a package, all other resources go to title lookup
      return eresource.class === resourceClasses.PACKAGE ?
        urls.packageView(id) :
        urls.titleView(id);
    }
    return undefined;
  }

  render() {
    const { eresource, searchString = '', ...rest } = this.props;

    const name = this.getName(eresource);
    const path = this.getPath(eresource);
    if (!path) return name || <NoValue />;

    return (
      <Link {...rest} data-test-eresource-name to={`${this.getPath(eresource)}${searchString}`}>
        {name}
      </Link>
    );
  }
}

export default EResourceLink;
