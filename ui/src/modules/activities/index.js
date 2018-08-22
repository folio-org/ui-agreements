import React from 'react'
import { hot } from 'react-hot-loader'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'

import AddToAgreementActivityComponent from './addActivityComponent'
import PurchaseActivityComponent from './purchaseActivityComponent'

const Routes = ({app, match, ...props}) => (
  <Switch>
    <Route {...props} exact path={match.path+'/activity/add'} render={(p) => <AddActivityComponent {...p} app={app} />} />
    <Route {...props} exact path={match.path+'/activity/purchase'} render={(p) => <PurchaseActivityComponent {...p} app={app} />} />
  </Switch>
)

export default hot(module)(Routes);
