import React, {Component} from 'react'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

const ResourceView = observer( (props) => (
  <h2> Resource {props.current.id} </h2>
))

export default hot(module) (ResourceView)
