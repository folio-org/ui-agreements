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
      currentActivity: props.currentActivity,
    }

  }

  render() {
    return (
      <div>
	CA::{this.state.currentActivity}
        <AddActivity app={this.props.app} open={this.state.currentActivity=='addToAgreement'?true:false} />
      </div>
    )
  }
}
export default hot(module)(AddActivityComponent)
