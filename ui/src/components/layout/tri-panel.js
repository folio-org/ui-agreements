import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'


const TriPanel = observer(({left, center, right}) => {
  
  let totalCols = 12
  
  let leftCols = 0
  let rightCols = 0
  
  if (left) {
    leftCols = 2
  }
  
  if (right) {
    rightCols = 5
  }
    
  let centerCols = totalCols - (leftCols + rightCols)
  
  let leftComponent = left ? <Col lg={leftCols} xs={totalCols} className="position-fixed" >
    { left }
  </Col> : null
  
  let rightComponent = right ? <Col lg={{size:(rightCols), offset:(leftCols + centerCols) }} xs={totalCols} >
    { right }
  </Col> : null

  
  return (
    <Container fluid={true}>
      <Row>
        { leftComponent }
        
        <Col lg={{size:(centerCols), offset:(leftCols) }} xs={totalCols} >
          { center }
        </Col>
          
        { rightComponent }
      </Row>
    </Container>
  )
})

TriPanel.propTypes = {
  left: PropTypes.object,
  center: PropTypes.object.isRequired,
  right: PropTypes.object,
}

export default hot(module)(TriPanel)
