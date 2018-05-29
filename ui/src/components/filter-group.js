import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { hot } from 'react-hot-loader'
import {
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input} from 'reactstrap'


const getFilters = (filters, target, filterClick) => {
  let filterComponents = []
  for (var value in filters) {
    let fConf = filters[value]
    let id = `filter-${target}-${value}`
    filterComponents.push(
      <Filter key={id} id={id} name={target} className="toggle" filterClick={filterClick} value={value} defaultChecked={!!fConf.selected}>{fConf.text}</Filter>
    )
  }
  return filterComponents
}  
  
const Filter = ({id, name, value, defaultChecked, filterClick, children, ...otherProps}) => (
  <FormGroup {...otherProps} check >
    <Input id={id} value={value} onClick={(e) => {filterClick( name, value, e.target.checked )} } name={name} defaultChecked={defaultChecked} type="checkbox" />
    <Label for={id} check>{ children }</Label>
  </FormGroup>
)

const FilterGroup = observer(({ target, text, filters, expanded, filterClick, ...otherProps }) => (
  <Card>
    <CardHeader tag='h5' {...otherProps} >{ text }</CardHeader>
    <Collapse isOpen={!!expanded}> 
      <CardBody>
        { getFilters(filters, target, filterClick) }
      </CardBody>
    </Collapse>
  </Card>
))

export default hot(module) (FilterGroup)
