import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'

import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'

import { Link } from 'react-router-dom'

import ResourceCRUD from '../../lib/resource/resource-based-crud'



let searchIn = [
  '__cql'
]


const Packages = observer(({app}) => {

  const columns = [
    { Header: "Package Name", id: 'name', accessor: 'name' },
    { Header: "Source", id: 'source', accessor: 'source' },
    { Header: "Reference", id: 'reference', accessor: 'reference' },
    { Header: "KB", id: 'remotekb', accessor: 'remoteKb.name' },
  ]

  const filterGroups = {
  }


  return (
    <ResourceCRUD filterGroups={filterGroups} searchIn={searchIn} columnDef={columns} app={app} resource="Pkg" />
  )

})


export default hot(module)(Packages)
