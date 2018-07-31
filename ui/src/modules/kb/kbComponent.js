import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import Kb from './kb'

import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'

class KbComponent extends React.Component {

  render() {
    console.log('wibble');
    return (
      <Kb {...this.state} />
    )
  }
}
export default hot(module)(KbComponent)
