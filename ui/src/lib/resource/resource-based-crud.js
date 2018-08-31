import React, {Component} from 'react'
import {observable, action, computed} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col, Button } from 'reactstrap'
import FaClose from 'react-icons/lib/fa/close'
import FaSearch from 'react-icons/lib/fa/search'

import Search from '../../components/search'
import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import ResourceView from '../../lib/resource/resource-view'

const PanelHeader = ({ children }) => (
  <Row className="pb-3" >
    {children}
  </Row>
)

@observer
class ResourceCRUD extends Component {
  
  constructor (props) {
    super (props)
  }
  
  @observable
  left = true
  
  @action.bound
  toggleLeft() {
    this.left = !!!this.left
  }
  
  @computed
  get right() {
    return this.current && this.current.id
  }
  
  @observable
  current = {}
  
  isCurrent = (id) => (this.current.id == id)
  
  @action.bound
  currentToggle = (current) => {
    if (this.current.id == current.id) {
      this.currentClear()
    } else {
      this.current = current
    }
  }
  
  @action.bound
  currentClear = () => {
    this.current = {}
  }

  render(){

    let showLeft = !!this.left
    let showRight = !!this.right
      
    let totalCols = 12
    let leftCols = (showLeft ? 2 : 0)
    let rightCols = (showRight ? 5 : 0)
    
    let centerCols = totalCols - (leftCols + rightCols)
    
    
    let {viewPanelComponent, ...viewProps} = this.props
    
    viewPanelComponent = viewPanelComponent ?
      React.createElement(
        viewPanelComponent,
        { current: this.current, ...viewProps }
      ) : 
      <ResourceView current={this.current} />
    
    console.log (viewPanelComponent) 
    
    return <Container fluid={true}>
      <Row>
        { this.left ? <Col lg={leftCols} xs={totalCols} className="position-fixed" >
          <PanelHeader>
            <Button color="light" onClick={this.toggleLeft} ><FaClose /></Button>
          </PanelHeader>
          <Search className="w-100" app={this.props.app} filters={this.props.filterGroups} />
        </Col> : null }
        
        <Col lg={{size:(centerCols), offset:(leftCols) }} xs={totalCols} >
          <PanelHeader>
            { !this.left && <Button color="light" onClick={this.toggleLeft} ><FaSearch /></Button>}
          </PanelHeader>
          
          <UrlParamResourceSearch isCurrent={this.isCurrent} currentToggle={this.currentToggle} resource={this.props.resource} fieldsToSearch={this.props.searchIn} columnDef={this.props.columnDef} app={this.props.app} />
        </Col>
          
        { this.right ? <Col lg={{size:(rightCols)}} xs={totalCols} >
          <PanelHeader>
            <Button color="light" onClick={this.currentClear} ><FaClose /></Button>
          </PanelHeader>
          
          { viewPanelComponent }
          
        </Col> : null }
      </Row>
    </Container>
  }
}

export default hot(module)(ResourceCRUD)
