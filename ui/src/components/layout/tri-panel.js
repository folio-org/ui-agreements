import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col, Button } from 'reactstrap'
import { observable, action } from 'mobx'
import FaClose from 'react-icons/lib/fa/close'
import FaSearch from 'react-icons/lib/fa/search'

const PanelHeader = ({ children }) => (
  <Row className="pb-3" >
    {children}
  </Row>
)

@observer
class TriPanel extends Component {
  
  static propTypes = {
    left: PropTypes.object,
    center: PropTypes.object.isRequired,
    right: PropTypes.object,

    leftHeading: PropTypes.object,
    heading: PropTypes.object,
    rightHeading: PropTypes.object,
    
    totalCols: PropTypes.number,
    leftCols: PropTypes.number,
    rightCols: PropTypes.number,
  }
  
  @observable
  totalCols = 12
  
  @observable
  leftCols = 2
  
  @observable
  rightCols = 5
  
  @observable
  left
  
  @observable
  right
  
  @observable
  center
  
  constructor ( props ) {
    super (props)

    this.left = props.left
    this.right = props.right
    this.center = props.center
    
    if (props.totalCols) {
      this.totalCols = props.totalCols
    }
    
    if (props.leftCols) {
      this.leftCols = props.leftCols
    }
    
    if (props.totalCols) {
      this.rightCols = props.rightCols
    }
  }
  
  @observable
  showLeft = true
  
  @observable
  showRight = true
  
  @action.bound
  toggleLeft = () => {
    this.showLeft = !this.showLeft
    
    console.log (`Left should be ${this.showLeft ? 'visible' : 'hidden'}`)
  }
  
  render = () => {
    
    const {leftHeading, heading, rightHeading} = this.props
    
    let visibleLeftCols = 0
    let visibleRightCols = 0
    
    if (this.left && this.showLeft) {
      visibleLeftCols = this.leftCols
    }
    
    if (this.right && this.showRight) {
      visibleRightCols = this.rightCols
    }

    let centerCols = this.totalCols - (visibleLeftCols + visibleRightCols)

    let leftComponent = (this.left || leftHeading) && this.showLeft ? <Col lg={visibleLeftCols} xs={this.totalCols} className="position-fixed" >
      <PanelHeader>
        <Button color="light" onClick={this.toggleLeft} ><FaClose /></Button>
      </PanelHeader>
      { this.left }
    </Col> : null

    let rightComponent = this.right || rightHeading? <Col lg={{size:(visibleRightCols), offset:(visibleLeftCols + centerCols) }} xs={this.totalCols} >
      { this.right }
    </Col> : null

    return (
      <Container fluid={true}>
        <Row>
          { leftComponent }
          
          <Col lg={{size:(centerCols), offset:(visibleLeftCols) }} xs={this.totalCols} >
            <PanelHeader>
              { (!this.showLeft && this.left) && <Button color="light" onClick={this.toggleLeft} ><FaSearch /></Button>}
            </PanelHeader>
            
            { this.center }
          </Col>
            
          { rightComponent }
        </Row>
      </Container>
    )
  }
}

export default hot(module)(TriPanel)
