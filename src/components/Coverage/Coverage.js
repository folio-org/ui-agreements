import React from 'react';
import PropTypes from 'prop-types';
import SerialCoverage from './SerialCoverage';
import MonographCoverage from './MonographCoverage';
import { resourceTypes } from '../../constants';

export default class Coverage extends React.Component {
  static propTypes = {
    pci: PropTypes.shape({
      resource: PropTypes.shape({
        _object: PropTypes.shape({
          pti: PropTypes.shape({
            titleInstance: PropTypes.shape({
              dateMonographPublished: PropTypes.string,
              monographVolume: PropTypes.string,
              monographEdition: PropTypes.string,
              name: PropTypes.string
            }),
          })
        })
      }),
      _object: PropTypes.shape({
        pti: PropTypes.shape({
          titleInstance: PropTypes.shape({
            dateMonographPublished: PropTypes.string,
            monographVolume: PropTypes.string,
            monographEdition: PropTypes.string,
            name: PropTypes.string
          }),
        })
      })
    })
  }

  render() {
    /* This component can be called from an agreement line context or from an eresource context. If we're looking at an agreement line,
    * we need to take the possibility of custom coverage into account.
    */

    const { pci, isLine } = this.props;

    let isMonograph = false
    let pciToRender = pci

    /* Sometimes the objects passed in from agreement view are of the form 
    * pci: {resource: {_object: pti: {etc}}}
    * which is the case in agreement lines
    * and sometimes of the form
    * pci: {_object: pti: {etc}}
    * which is the case in covered eresources
    * so we need a way to figure out which case we're in.
    *
    * This could alternatively be accomplished with another prop, or in the individual components called here.
    */

    if (isLine) {
      if ('resource' in pci) {
        if (pci?.resource?._object?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
          isMonograph = true
          pciToRender = pci?.resource?._object
        }
      } else {
        if (pci?._object?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
          isMonograph = true
          pciToRender = pci?._object
        }
      }
    } else {
      if (pci?._object?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
        isMonograph = true
        pciToRender = pci?._object
      } else {
        pciToRender = pci?._object
      }
    }

    if (isMonograph) {
      return (
        <MonographCoverage pci={pciToRender} />
      );
    } else {
      return (
        <SerialCoverage statements={pciToRender.coverage} />
      );
    }
  }
}
