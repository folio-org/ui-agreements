import React, {Component} from 'react'
import {observable, action} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'

import TriPanel from '../../components/layout/tri-panel'
import Search from '../../components/search'
import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'

@observer
class ResourceCRUD extends Component {
  
  constructor (props) {
    super (props)
  }
  
  @observable
  current = { 
    id: ''
  }
  
  isCurrent = (id) => (this.current.id == id)
  
  @action.bound
  currentToggle = (current) => {
    if (this.current.id == current.id) {
      this.current = { id : '' }
    } else {
      this.current = current
    }
    
    console.log (this.current)
  }
  
  render = () => (
    <TriPanel
      left= { <Search className="w-100" app={this.props.app} filters={this.props.filterGroups} /> }
      center= { <UrlParamResourceSearch isCurrent={this.isCurrent} currentToggle={this.currentToggle} resource={this.props.resource} fieldsToSearch={this.props.searchIn} columnDef={this.props.columnDef} app={this.props.app} /> }
    />
  )
}

export default hot(module)(ResourceCRUD)
