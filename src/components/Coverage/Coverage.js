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
      })
    }),
    line: PropTypes.shape({
      resource: PropTypes.shape({
        _object: PropTypes.shape({
          pci: PropTypes.shape({
            pti: PropTypes.shape({
              titleInstance: PropTypes.shape({
                dateMonographPublished: PropTypes.string,
                monographVolume: PropTypes.string,
                monographEdition: PropTypes.string,
                name: PropTypes.string
              })
            })
          })
        })
      })
    }),
    coveredEResource: PropTypes.shape({
      _object: PropTypes.shape({
        pci: PropTypes.shape({
          pti: PropTypes.shape({
            titleInstance: PropTypes.shape({
              dateMonographPublished: PropTypes.string,
              monographVolume: PropTypes.string,
              monographEdition: PropTypes.string,
              name: PropTypes.string
            })
          })
        })
      })
    }),
  }

  /* This component can be called from an agreement line context or from an eresource context, so we pass in the data on one of three props,
  * depending on the shape of that data.
  */

  render() {
    const { pci, line, coveredEResource } = this.props;
    let isMonograph = false;
    let dataToRender;

    if (pci) {
      if (pci?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
        isMonograph = true;
      }
      dataToRender = pci;
    } else if (line) {
      if (line?.resource?._object?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
        isMonograph = true;
        dataToRender = line?.resource?._object;
      } else {
        dataToRender = line;
      }
    } else if (coveredEResource?._object?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
      isMonograph = true;
      dataToRender = coveredEResource?._object;
    } else {
      dataToRender = coveredEResource;
    }

    if (isMonograph) {
      return (
        <MonographCoverage pci={dataToRender} />
      );
    } else {
      return (
        <SerialCoverage statements={dataToRender.coverage} />
      );
    }
  }
}
