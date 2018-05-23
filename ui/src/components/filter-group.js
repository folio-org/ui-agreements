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

let Filter = ({id, name, value, defaultChecked, filterClick, children, ...otherProps}) => (
  <FormGroup key={id} {...otherProps} check >
    <Input id={id} value={value} onClick={(e) => {filterClick( name, value, e.target.checked )} } name={name} defaultChecked={defaultChecked} type="checkbox" />
    <Label for={id} check>{ children }</Label>
  </FormGroup>
)

const FilterGroup = observer(({ target, text, filters, expanded, filterClick, ...otherProps }) => (
  <Card>
    <CardHeader tag='h5' {...otherProps} >{ text }</CardHeader>
    <Collapse isOpen={!!expanded}> 
      <CardBody>
        <Form>
          {filters.map(({text, value, selected}, index) => (
            <Filter id={`filter-${target}-${value}`} name={target} filterClick={filterClick} value={value} defaultChecked={selected}>{text}</Filter>
          ))}
        </Form>
      </CardBody>
    </Collapse>
  </Card>
))

export default hot(module) (FilterGroup)
