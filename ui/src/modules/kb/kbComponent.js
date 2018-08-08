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
      showDetailPane: false,
      showFilterPane: true,
      selectedDetailRecord: null
    }

    this.handleTest = this.handleTest.bind(this);
    this.handleCloseDetail = this.handleCloseDetail.bind(this);
    this.handleCloseFilter = this.handleCloseFilter.bind(this);
    this.handleSelectPCI = this.handleSelectPCI.bind(this);
  }

  handleCloseFilter() {
    console.log("handleCloseFilter");
    this.setState({showFilterPane:false});
  }

  handleCloseDetail() {
    console.log("handleCloseDetail");
    this.setState({showDetailPane:false});
  }

  handleTest() {

    console.log("handleTest::test %o",this.props.app);
    console.log("API root: %s",this.props.app.apiConfig.root);
    this.props.app.fetchJSON (this.props.app.apiConfig.root+'/knowledgebase').then((jsonData) => {
      console.log("result of /knowlegebase: %o",jsonData);
    })
  }

  /**
   * Called when a user clicks on the select button in a row. could equally be called on select of the row
   */
  handleSelectPCI(pci) {
    console.log("handleSelectPCI",pci);
    this.setState({showDetailPane:true, selectedDetailRecord:pci});
  }

  render() {
    return (
      <Kb onTest={this.handleTest} 
      	  showFilterPane={this.state.showFilterPane} 
      	  showDetailPane={this.state.showDetailPane} 
      	  handleCloseFilter={this.handleCloseFilter} 
	        handleCloseDetail={this.handleCloseDetail} 
          handleSelectPCI={this.handleSelectPCI}
      	  app={this.props.app} />
    )
  }
}
export default hot(module)(KbComponent)
