import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

import Packages from './packages'

class PackagesComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
   return (
      <Packages {...this.props} />
    )
  }
}
export default hot(module)(PackagesComponent)
