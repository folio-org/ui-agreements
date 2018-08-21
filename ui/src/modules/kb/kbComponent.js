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
      selectedDetailRecord: null,
      selection: [],
      detailPaneContent: null,
      currentActivity:'none'
    }

    this.handleCloseDetail = this.handleCloseDetail.bind(this);
    this.handleCloseFilter = this.handleCloseFilter.bind(this);
    this.kbTableRowClicked = this.kbTableRowClicked.bind(this);
    this.startActivity = this.startActivity.bind(this);
  }

  handleCloseFilter() {
    console.log("handleCloseFilter");
    this.setState({showFilterPane:false});
  }

  handleCloseDetail() {
    console.log("handleCloseDetail");
    this.setState({showDetailPane:false});
  }

  kbTableRowClicked(e,rowInfo) {
    console.log("kbTableRowClicked %o %o",e,rowInfo)
    // set the detailPaneContent to be our pciComponent
    this.detailPaneContent="pciComponent";
    // and Switch on the detail pane
    this.setState({showDetailPane:true, selectedDetailRecord:rowInfo.original});
  }

  startActivity(activity) {
    console.log("startActivity(%s)",activity);
    this.setState({currentActivity:activity});
  }

  render() {
    return (
      <Kb showFilterPane={this.state.showFilterPane} 
      	  showDetailPane={this.state.showDetailPane} 
      	  selectedDetailRecord={this.state.selectedDetailRecord} 
      	  handleCloseFilter={this.handleCloseFilter} 
	  handleCloseDetail={this.handleCloseDetail} 
          kbTableRowClicked={this.kbTableRowClicked}
	  selection={this.state.selection}
	  detailPaneContent={this.detailPaneContent}
	  currentActivity={this.state.currentActivity}
	  startActivity={this.startActivity}
      	  app={this.props.app} />
    )
  }
}
export default hot(module)(KbComponent)
