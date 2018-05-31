import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable, action, toJS } from 'mobx'
import { hot } from 'react-hot-loader'
import { fill } from 'lodash'
import FilterGroup from './filter-group'
  
// Case insensitive match
const FILTER_COMPARATOR = '=i='
const FILTER_GROUP_OPARATOR = '||'

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
    
    // Default filter values.
    this.defaultFilterVals()
  }
  
  @action.bound
  defaultFilterVals = () => {

    try {
      // Grab the query string as an object
      let vals = this.app.queryStringObject.filters
      if (vals) {
        
        if (typeof vals === 'string') {
          vals = [vals]
        }
        
        vals.forEach(( filter ) => {
          let entries = filter.split(FILTER_GROUP_OPARATOR)
          if (entries) {
            entries.forEach(( entry ) => {
              let name_value = entry.split(FILTER_COMPARATOR)
              
              // Get from our filter list.
              let theFilter = this.fgs.get(name_value[0])
              if (theFilter) {
              
                // Set active filter map.
                this.addActiveFilter(name_value[0], name_value[1], true)
                
                // Set in initial values map too.
                theFilter.filters[name_value[1]].selected = true
              }
            })
          }
        })
      }
    } catch (e) {
      this.app.log('Error parsing filters', e)
    }
  }
  
  @action.bound
  groupClick = (i) => {
    this.expanded[i] = !this.expanded[i]
  }
  
  filterStringArray = (filtersMap) => (
    filtersMap.entries().map((entry) => {
      let filterName = entry[0]
      let filterValues = entry[1]
      return filterValues.map((item) => (`${filterName}${FILTER_COMPARATOR}${item}`)).join(FILTER_GROUP_OPARATOR)
    })
  )
  
  
  @action.bound
  addActiveFilter = (name, value, selected) => {
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
    }
  }
  
  filterClick = ( name, value, selected ) => {
    
    this.addActiveFilter( name, value, selected )
    
    // Just call the method that adds to the query params.
    this.app.addToQueryString ( {filters: this.filterStringArray(this.activeFilters)} )
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
