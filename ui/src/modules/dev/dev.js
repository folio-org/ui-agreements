import React from 'react'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

import Search from '../../components/search'
import TriPanel from '../../components/layout/tri-panel'

import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'

import AddActivityComponent from '../activities/addActivityComponent'

class Dev extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  @observable currentActivity = null;

  @action.bound
  startActivity(activity) {
    console.log("startActivity(%s)",activity);
    this.currentActivity=activity;
  }

  
  render() {
    return (
      <div>
        <h1>Development actions</h1>
        <ul>
          <li><button className="btn btn-primary">Import Ebsco Package Test</button></li>
          <li><button className="btn btn-primary" onClick={() => this.startActivity("purchase")}>Test Purchase Activity (Explicit List)</button></li>
          <li><button className="btn btn-primary">Test Purchase Activity (All via query)</button></li>
          <li><button className="btn btn-primary" onClick={() => this.startActivity("addToAgreement")}>Test Add To Agreement Activity (Explicit List)</button></li>
          <li><button className="btn btn-primary">Test Add To Agreement Activity (All via query)</button></li>
        </ul>
        <AddActivityComponent app={this.props.app} currentActivity={'fhfh'}/>
      </div>
    )
  }

}

export default hot(module)(Dev)
