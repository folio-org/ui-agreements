import React from 'react';
import PropTypes from 'prop-types';

class FolioLink extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func,
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
    const { children, path, ...rest } = this.props;

    if (!path) return <span {...rest}>{children}</span>;

    return <a {...rest} href={path} onClick={this.handleClick}>{children}</a>;
  }
}

export default FolioLink;
