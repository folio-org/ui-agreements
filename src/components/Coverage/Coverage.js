import React from 'react';
import PropTypes from 'prop-types';
import SerialCoverage from './SerialCoverage';
import MonographCoverage from './MonographCoverage';
import Embargo from '../Embargo';
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
    eResource: PropTypes.shape({
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
    const { pci, line, eResource } = this.props;
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
    } else if (eResource?._object?.pti?.titleInstance?.type?.value === resourceTypes.MONOGRAPH) {
      isMonograph = true;
      dataToRender = eResource?._object;
    } else {
      dataToRender = eResource;
    }

    if (isMonograph) {
      return (
        <div>
          <MonographCoverage pci={dataToRender} />
          <Embargo embargo={dataToRender.embargo} />
        </div>
      );
    } else {
      return (
        <div>
          <SerialCoverage statements={dataToRender.coverage} />
          <Embargo embargo={dataToRender.embargo} />
        </div>
      );
    }
  }
}
