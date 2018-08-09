import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'
import Dash from './dash'

class DashComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

    this.handleTriggerSync = this.handleTriggerSync.bind(this);
  }

  handleTriggerSync() {
    console.log("handleTriggerSync::test %o",this.props.app);
    // this.props.app.fetchJSON (this.props.app.apiConfig.root+'/knowledgebase').then((jsonData) => {
    //   console.log("result of /knowlegebase: %o",jsonData);
    // })
  }

  render() {
    return (
      <Dash handleTriggerSync={this.handleTriggerSync} app={this.props.app} />
    )
  }
}
export default hot(module)(DashComponent)

