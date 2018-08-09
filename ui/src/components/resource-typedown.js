import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { hot } from 'react-hot-loader'
import {
  Form,
  FormGroup,
  Label,
  Input} from 'reactstrap'


const ResourceTypedown = observer(({ ...otherProps }) => (
  <p>Resource Typedown</p>
))

export default hot(module) (ResourceTypedown)
