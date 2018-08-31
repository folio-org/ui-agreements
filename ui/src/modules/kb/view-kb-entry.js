import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Form, FormGroup, Label, Col, Input } from 'reactstrap'

const ViewKBEntry = observer(( { current } ) => {
  
  return (
    <Form>
      <FormGroup row>
        <Label sm={2} >Title</Label>
        <Col sm={10} >
          <Input  plaintext >{ current.pti.titleInstance.title }</Input>
        </Col>
      </FormGroup>
      
    </Form>
  )
})
  
export default hot(module) (ViewKBEntry)
