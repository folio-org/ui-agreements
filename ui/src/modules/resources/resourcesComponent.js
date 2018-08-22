import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'

import {tableFormatters, textHighlighter} from '../../lib/helpers'

class ResourcesComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <p>resources</p>
    )
  }
}
export default hot(module)(ResourcesComponent)
