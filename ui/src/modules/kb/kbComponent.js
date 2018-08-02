import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import Kb from './kb'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

class KbComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showPane: true
    }

    this.handleTest = this.handleTest.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    console.log("handleClose");
  }

  handleTest() {

    console.log("handleTest::test %o",this.props.app);
    console.log("API root: %s",this.props.app.apiConfig.root);
    this.props.app.fetchJSON (this.props.app.apiConfig.root+'/knowledgebase').then((jsonData) => {
      console.log("result of /knowlegebase: %o",jsonData);
    })
  }

  render() {
    return (
      <Kb onTest={this.handleTest} onClose={this.handleClose} showPane={this.state.showPane} app={this.props.app} />
    )
  }
}
export default hot(module)(KbComponent)
