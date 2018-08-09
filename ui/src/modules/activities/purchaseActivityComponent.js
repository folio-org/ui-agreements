import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import PurchaseActivity from './purchaseActivity'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

/** A workflow screen for controlling the purchase of items */
class PurchaseActivityComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {
    return (
      <PurchaseActivity app={this.props.app} />
    )
  }
}
export default hot(module)(PurchaseActivityComponent)
