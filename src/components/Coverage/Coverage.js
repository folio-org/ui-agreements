import React from 'react';
import PropTypes from 'prop-types';
import SerialCoverage from './SerialCoverage';
import MonographCoverage from './MonographCoverage';
import { resourceTypes } from '../../constants';

export default class Coverage extends React.Component {
  static propTypes = {
    pci: PropTypes.shape({
      pti: PropTypes.shape({
        titleInstance: PropTypes.shape({
          dateMonographPublished: PropTypes.string,
          monographVolume: PropTypes.string,
          monographEdition: PropTypes.string,
          name: PropTypes.string
        }),
      }).isRequired
    }),
  }

  render() {
    const { pci } = this.props;
    if (pci?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
      return (
        <MonographCoverage pci={pci} />
      );
    } else {
      return (
        <SerialCoverage statements={pci.coverage} />
      );
    }
  }
}
