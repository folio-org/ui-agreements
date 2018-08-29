import React from 'react'
import {observer} from 'mobx-react'
import { ReactTableDefaults } from 'react-table'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'

/**
 * Observer type row component. Allows for changes to observables to cause a redraw. This will change when observable properties are updated.
 */

const RowComponent =  observer(({className, selections, row, isCurrent, currentIdToggle, onClick, ...props}) => {
  let rowClasses = {}
  
  const rowClick = (e) => {
    if (row.id) {
      currentIdToggle(row.id)
    }
    if (onClick) {
      onClick();
    }
  }
  
  
  if (row && row.id) {
    if (selections.has(row.id)) {
      // Add to the properties.
      rowClasses['bg-secondary'] = true
      rowClasses['text-white'] = true
    }
    
    if (isCurrent(row.id)) {

      rowClasses['bg-secondary'] = false
      rowClasses['bg-primary'] = true
      rowClasses['text-white'] = true
    }
  }
  
  return <ReactTableDefaults.TrComponent className={classNames(className, rowClasses)} onClick={rowClick} { ...props } />

})

// The property types.
RowComponent.propTypes = {
  className: PropTypes.string,
  
  selections: PropTypes.shape({
    has: PropTypes.func.isRequired
  }).isRequired,
  
  row: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  
  isCurrent: PropTypes.func.isRequired,
  
  currentIdToggle: PropTypes.func.isRequired
}

export default hot(module)(RowComponent)
