import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Route, Link } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  NavLink} from 'reactstrap'

let isOpen = observable(false)

export default observer(({location, ...props}) => (
  <Navbar {...props} >
    <Nav pills >
      <Route location={location} path='/erm' exact children={({ match }) => {
        let selected = !!match
        let disabled = (match && match.isExact)
        return (<NavItem>
          <NavLink active={selected} disabled={disabled} to='/erm' tag={Link} >Dash</NavLink>
        </NavItem>)
      }} />
      <Route location={location} path='/erm/agreements' children={({ match }) => {
        let selected = !!match
        let disabled = (match && match.isExact)
        return (<NavItem>
          <NavLink active={selected} disabled={disabled} disabled={disabled} to='/erm/agreements' tag={Link} >Agreements</NavLink>
        </NavItem>)
      }} />
    </Nav>
  </Navbar>
 ))