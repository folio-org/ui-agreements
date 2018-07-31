import React from 'react'
import PropTypes from 'prop-types'
import { Route, Link } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  NavLink as RSNavLink} from 'reactstrap'

const RouterNavlink = ({location, to, exact, children, ...navLinkProps}) => {
  return (<Route location={location} exact={exact} path={to} children={({ match }) => {
    let selected = !!match
    let disabled = (match && match.isExact)
    return (<NavItem>
      <RSNavLink active={selected} disabled={disabled} disabled={disabled} to={ to } tag={Link} {...navLinkProps} >{children}</RSNavLink>
    </NavItem>)
  }} />)
}

RouterNavlink.propTypes = Object.assign({
  to: PropTypes.string.isRequired,
  location: Route.propTypes.location,
  exact: Route.propTypes.exact
}, RSNavLink.propTypes)

export default ({location, match, ...props}) => (
  <Navbar {...props} >
    <Nav pills >
      <RouterNavlink location={location} to={match.path} exact >Dash</RouterNavlink>
      <RouterNavlink location={location} to={match.path + '/agreements'} >Agreements</RouterNavlink>
      <RouterNavlink location={location} to={match.path + '/licenses'} >Licenses</RouterNavlink>
      <RouterNavlink location={location} to={match.path + '/titles'} >Titles</RouterNavlink>
      <RouterNavlink location={location} to={match.path + '/packages'} >Packages</RouterNavlink>
      <RouterNavlink location={location} to={match.path + '/kb'} >KB</RouterNavlink>
    </Nav>
  </Navbar>
)

export { RouterNavlink as NavLink} 
 
