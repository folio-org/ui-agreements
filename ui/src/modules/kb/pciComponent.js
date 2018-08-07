import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import Pci from './pci'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

class PCIComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {
    return (
      <Pci app={this.props.app} />
    )
  }
}
export default hot(module)(PCIComponent)
