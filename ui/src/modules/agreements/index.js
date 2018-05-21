import React from 'react'
import Agreements from './agreements'
import AppModule from '../app-module'
import Route from 'react-router-dom/Route'

const Routes = ({app, ...props}) => (
  <Route {...props} path="/agreements/:resourceId?" render={() => ( <Agreements app={app} /> )} />
)

export default Routes;