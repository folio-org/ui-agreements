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

export default observer((props) => (
  <Navbar {...props} >
    <Collapse isOpen={isOpen.get()} navbar >
      <Nav className="ml-auto" navbar >
        <Route path='/erm/agreements' children={({ match }) => (
          <NavItem active={match ? true : false} >
            <NavLink active={match ? true : false} to='/erm/agreements' tag={Link} >Agreements</NavLink>
          </NavItem>
        )} />
      </Nav>
    </Collapse>
  </Navbar>
 ))