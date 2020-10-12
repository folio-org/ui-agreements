import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

class FolioLink extends React.Component {
  static manifest = Object.freeze({
    query: {},
  });

  static propTypes = {
    children: PropTypes.node,
    linkProps: PropTypes.object,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func,
      }),
    }),
    resources: PropTypes.shape({
      query: PropTypes.shape({
        _path: PropTypes.string,
      }),
    }),
    path: PropTypes.string,
  }

  handleClick = (e) => {
    if (e) e.preventDefault();

    this.props.mutator.query.update({
      _path: this.props.path,
    });

    return false;
  }

  render() {
    const { children, linkProps, path } = this.props;

    if (!path) return <span {...linkProps}>{children}</span>;

    const { location: { pathname } } = document;
    const currentPage = pathname.substring(0, pathname.indexOf('/', 5));
    const targetPage = path.substring(0, path.indexOf('/', 5));

    if (currentPage !== targetPage) return <Link {...linkProps} to={path}>{children}</Link>;

    return <a {...linkProps} href={path} onClick={this.handleClick}>{children}</a>;
  }
}

export default stripesConnect(FolioLink);
