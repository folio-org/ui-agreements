import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import AddActivity from './addActivity'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

/** A workflow screen for controlling the purchase of items */
class AddActivityComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {
    return (
      <AddActivity app={this.props.app} />
    )
  }
}
export default hot(module)(AddActivityComponent)
