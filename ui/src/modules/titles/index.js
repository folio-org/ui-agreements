import React from 'react'
import { hot } from 'react-hot-loader'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import TitlesComponent from './titlesComponent'


const Routes = ({app, match, ...props}) => (
  <Switch>
    <Route {...props} exact path={match.path+'/titles'} render={() => <TitlesComponent app={app} />} />
  </Switch>
)

export default hot(module)(Routes);

