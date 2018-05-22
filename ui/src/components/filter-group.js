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
  FormGroup,
  Label,
  Input} from 'reactstrap'

let Filter = ({name, value, defaultChecked, filterClick, children, ...otherProps}) => (
  <FormGroup {...otherProps} check >
    <Label check >
      <Input value={value} onClick={(e) => {filterClick( name, value, e.target.checked )} } name={name} defaultChecked={defaultChecked} type="checkbox" />
      { children }
    </Label>
  </FormGroup>
)

const FilterGroup = observer(({ target, text, filters, expanded, filterClick, ...otherProps }) => (
  <Card>
    <CardHeader tag='h5' {...otherProps} >{ text }</CardHeader>
    <Collapse isOpen={!!expanded}> 
      <CardBody>
        {filters.map(({text, value, selected}, index) => (
          <Filter key={`filter-${target}-${value}`} name={`${target}`} filterClick={filterClick} value={value} defaultChecked={selected}>{text}</Filter>
        ))}
      </CardBody>
    </Collapse>
  </Card>
))

export default hot(module) (FilterGroup)
