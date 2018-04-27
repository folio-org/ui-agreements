import React from 'react'
import PropTypes from 'prop-types'
import { Route, Link } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  NavLink} from 'reactstrap'

let RouterNavlink = ({location, to, exact, children, ...navLinkProps}) => {
  return (<Route location={location} exact={exact} path={to} children={({ match }) => {
    let selected = !!match
    let disabled = (match && match.isExact)
    return (<NavItem>
      <NavLink active={selected} disabled={disabled} disabled={disabled} to='/erm/agreements' tag={Link} {...navLinkProps} >{children}</NavLink>
    </NavItem>)
  }} />)
}

RouterNavlink.propTypes = Object.assign({
  location: Route.propTypes.location,
  to: PropTypes.string.isRequired,
  exact: Route.propTypes.exact,
}, NavLink.propTypes)

export { RouterNavLink as NavLink }
export default ({location, ...props}) => (
  <Navbar {...props} >
    <Nav pills >
      <RouterNavlink location={location} to='/erm/dash' exact >Dash</RouterNavlink>
      <RouterNavlink location={location} to='/erm/agreements' >Agreements</RouterNavlink>
    </Nav>
  </Navbar>
)
 