import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import stringReplace from 'react-string-replace'

import ResourceBasedTable from './lib/resource/resource-based-table'
import {tableFormatters} from './lib/helpers'
import Nav from './layout/nav'

const Dash = observer((props) => {
  
  return (
    <div>
      <Nav app={props.app} />
      <Container fluid={true}>
	 ERM Dash
      </Container>
    </div>
  )
})

export default hot(module)(Dash)
