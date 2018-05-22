import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import { hot } from 'react-hot-loader'
import { fill } from 'lodash'
import FilterGroup from './filter-group'
  
@observer
class Filters extends Component {
  @observable expanded = []
  @observable fgs = new Map()
  @observable activeFilters = new Map()
  @observable app
  
  constructor (props) {
    super(props)
    this.fgs.replace( props.filters )
    this.expanded = fill(Array(this.fgs.size), true)
    this.app = props.app
  }
  
  @action.bound
  groupClick = (i) => {
    this.expanded[i] = !this.expanded[i]
  }
  
  filterStringArray = (filtersMap) => (
    filtersMap.entries().map((entry) => {
      let filterName = entry[0]
      let filterValues = entry[1]
      return filterValues.map((item) => (`${filterName}=i=${item}`)).join('||')
    })
  )
  
  @action.bound
  filterClick = ( name, value, selected ) => {
    let current = this.activeFilters.get(name)
    if (!current) {
      this.activeFilters.set(name, [])
      current = this.activeFilters.get(name)
    }
    
    let index = current.indexOf(value)
    let modify = (selected && index < 0) || (!selected && index > -1)
    
    if (modify) {
      if (selected) {
        current.push(value)
      } else {        
        current.remove(value)
      }

      // Add to the query params here.
      this.activeFilters.set(name, current)
      
      // Just call the method that adds to the query params.
      this.app.addToQueryString ( {filters: this.filterStringArray(this.activeFilters)} )
    }
    
    console.log({ name, value, selected })
  }
  
  render = () => (
    <div>
      {this.fgs.entries().map(( entry, index ) => {
        return (
          <FilterGroup key={ `filter-group-${index}` } filterClick={this.filterClick} onClick={() =>{ this.groupClick(index) }}
            target={ entry[0] } expanded={ this.expanded[index] } { ...entry[1] } />
        )
      })}
    </div>
  )
}

export default hot(module) (Filters)
