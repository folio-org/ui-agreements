import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'

@observer
class TriPanel extends Component {
  
  static propTypes = {
    left: PropTypes.object,
    center: PropTypes.object.isRequired,
    right: PropTypes.object,
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
  
  render = () => {
    
    let visibleLeftCols = 0
    let visibleRightCols = 0
    
    if (this.left) {
      visibleLeftCols = this.leftCols
    }
    
    if (this.right) {
      visibleRightCols = this.rightCols
    }

    let centerCols = totalCols - (visibleLeftCols + visibleRightCols)

    let leftComponent = this.left ? <Col lg={visibleLeftCols} xs={totalCols} className="position-fixed" >
      { left }
    </Col> : null

    let rightComponent = this.right ? <Col lg={{size:(visibleRightCols), offset:(visibleLeftCols + centerCols) }} xs={totalCols} >
      { right }
    </Col> : null

    return (
      <Container fluid={true}>
        <Row>
          { leftComponent }
          
          <Col lg={{size:(centerCols), offset:(visibleLeftCols) }} xs={totalCols} >
            { this.center }
          </Col>
            
          { rightComponent }
        </Row>
      </Container>
    )
  }
}

export default hot(module)(TriPanel)
