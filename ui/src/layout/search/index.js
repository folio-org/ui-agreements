import React from 'react'
import FaSearch from 'react-icons/lib/fa/search'
import { InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap'

export default (props) => (
  <InputGroup>
    <Input placeholder="Search" name="srch-term" id="srch-term" type="text" />
    <InputGroupAddon addonType="append" ><InputGroupText><FaSearch /></InputGroupText></InputGroupAddon>
  </InputGroup>
)
