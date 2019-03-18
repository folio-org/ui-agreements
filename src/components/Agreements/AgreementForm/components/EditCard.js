import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './EditCard.css';

export default class extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    header: PropTypes.node.isRequired,
    onDelete: PropTypes.func,
  }

  renderDeleteButton = () => (
    <Button
      buttonStyle="link slim"
      style={{ margin: 0, padding: 0 }}
      onClick={this.props.onDelete}
    >
      <Icon icon="trash" />
    </Button>
  )

  render() {
    const {
      children,
      header,
      onDelete,
      ...rest
    } = this.props;

    return (
      <div
        className={css.card}
        {...rest}
      >
        <div>
          <div className={css.header} start="xs">
            <div>
              <strong>{ header }</strong>
            </div>
            <div className={css.headerDelete}>
              { onDelete ? this.renderDeleteButton() : null }
            </div>
          </div>
          <div className={css.body}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
