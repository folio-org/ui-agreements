import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { hiddenAccordions } from '../../constants';

const hiddenAccordionsNames = Object.keys(hiddenAccordions);

class IfAccordionIsVisible extends React.Component {
  static manifest = {
    settings: {
      type: 'okapi',
      path: 'configurations/entries?query=(module=AGREEMENTS and configName=general)',
      records: 'configs',
      shouldRefresh: () => false,
    },
  };

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    name: PropTypes.oneOf(hiddenAccordionsNames).isRequired,
    resources: PropTypes.shape({
      settings: PropTypes.object,
    }),
  };

  isHidden = () => {
    const { settings = {} } = this.props.resources;
    const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
    return parsedSettings.hideAccordions?.[this.props.name];
  }

  render() {
    const { children } = this.props;
    const isEnabled = !this.isHidden();

    if (typeof children === 'function') {
      return children({ isEnabled });
    }

    return isEnabled ? children : null;
  }
}

export default stripesConnect(IfAccordionIsVisible);
