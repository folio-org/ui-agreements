import React from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'

/**
 * Observer type checkbox component for react table selection.
 * 
 */
const SelectComponent = observer(({ selectToggle, selections, row }) => {
  const selectClick = (e) => {
//    var shiftKey = e.shiftKey
//    e.stopPropagation()
    selectToggle(row.id)
  }
  
  // Read only component for checkbox. Just mimics the status of the row.
  return <input type="checkbox" defaultChecked={selections.has(row.id)} onClick={selectClick} />
})

// The property types.
SelectComponent.propTypes = {
  
  selections: PropTypes.shape({
    has: PropTypes.func.isRequired
  }).isRequired,
  
  row: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  
  selectToggle: PropTypes.func.isRequired
}

export default hot(module)(SelectComponent)
