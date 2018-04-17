import React from 'react'
import FaSearch from 'react-icons/lib/fa/search'
import { Form, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap'

export default (props) => {
  let {
    className,
    ...otherProps
  } = props;
    
  return (<InputGroup {...otherProps} className={['shadow', className || ''].join(' ')} >
    <Input placeholder="Search" name="srch-term" id="srch-term" type="text" />
    <InputGroupAddon addonType="append" >
      <InputGroupText> <FaSearch /> </InputGroupText>
    </InputGroupAddon>
  </InputGroup>)
}
