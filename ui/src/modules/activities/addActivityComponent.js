import React from 'react'
import PropTypes from 'prop-types'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import AddActivity from './addActivity'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

/** A workflow screen for controlling the purchase of items */
const AddActivityComponent = observer(( { app, currentActivity } ) => {
  
  return (
    <AddActivity app={app} open={!!currentActivity} />
  )
})


AddActivityComponent.propTypes = {
  currentActivity: PropTypes.string,
  app: PropTypes.object,
}

export default hot(module)(AddActivityComponent)
