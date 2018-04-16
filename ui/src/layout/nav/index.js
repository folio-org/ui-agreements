import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Search from '../search'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';

let toggle = observable(false)
let isOpen = observable(false)


export default observer((props) => (
  <Navbar light expand="md">
    <NavbarToggler onClick={toggle.get()} />
    <Search md="3" xs="12" />
    <Collapse isOpen={isOpen.get()} navbar>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink href="/components/">Components</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
   </Navbar>
 ))