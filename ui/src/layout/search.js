import React from 'react'
import FaSearch from 'react-icons/lib/fa/search'
import { Form, FormGroup, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap'
import {debounce} from 'lodash'

export default (props) => {
  let {
    app,
    ...otherProps
  } = props;

  
  let updateSearchTerm = debounce(( term ) => {
    app.addToQueryString ( {term: (term)} )
  }, app.appConfig.inputTimeout)
  
  let handleSearchTerm = ( event ) => {
    updateSearchTerm ( event.target.value )
  }
  
  return (<Form {...otherProps} >
    <FormGroup>
      <InputGroup className='shadow' >
        <Input onChange={handleSearchTerm} placeholder="Search" name="srch-term" id="srch-term" type="text" defaultValue={app.queryStringObject.term || ''} />
        <InputGroupAddon addonType="append" >
          <InputGroupText> <FaSearch /> </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>
    <FormGroup tag="fieldset">
      <legend>Filters</legend>
    </FormGroup>
  </Form>)
}
