import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

import Search from '../../components/search'
import TriPanel from '../../components/layout/tri-panel'

import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'

const Dev = observer((props) => {
  
  const filterGroups = {
  }
  
  return (
    <div>
      Dev panel
    </div>
  )
})

export default hot(module)(KbEntries)
