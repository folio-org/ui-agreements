import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Search from './search'
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';

let isOpen = observable(false)

export default observer((props) => (
  <Navbar color="light" sticky='top' light expand="lg" className="mb-4" >
    <Search app={props.app} className="px-0 col-lg-3 col-12" />
    <Collapse isOpen={isOpen.get()} navbar >
      <Nav className="ml-auto" navbar >
        <NavItem>
          <NavLink href="#placeholder/">Placeholder</NavLink>
          </NavItem>
        </Nav>
    </Collapse>
  </Navbar>
 ))