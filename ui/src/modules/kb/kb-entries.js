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

const searchIn = [
  'pti.titleInstance.title',
  'pkg.remoteKb.name',
  'pti.platform.name',
  'pkg.name',
  'pkg.source',
  'depth',
  'note'
]

const KbEntries = observer((props) => {
  
  const highlighter = textHighlighter ( () => (props.app.queryStringObject.term) )
  
  const columns = [
    { Header: "KB", id: 'PackageKB', accessor: 'pkg.remoteKb.name', Cell: (cell) => (highlighter(cell.value)) },
    {
      Header: "Title",
      id: 'pti.titleInstance.title',
      accessor: 'pti.titleInstance',
      Cell: tableFormatters.pipe( (cell) => (highlighter(cell.value.title)), (previous, cell) => (<Link to={`/olf-erm/titles/${cell.value.id}`}>{previous}</Link>) )
    },
    { Header: "Platform",accessor: 'pti.platform.name', Cell: (cell) => (highlighter(cell.value)) },
    { Header: "Source", accessor: 'pkg.source', Cell: (cell) => (highlighter(cell.value)) },
    { Header: "Package",
      id: 'pkg.name',
      accessor: 'pkg',
      Cell: tableFormatters.pipe( (cell) => (highlighter(cell.value.name)), (previous, cell) => (<Link to={`/olf-erm/packages/${cell.value.id}`}>{previous}</Link>) )
    },
    { Header: "Coverage Depth", accessor: 'depth', Cell: (cell) => (highlighter(cell.value))},
    { Header: "Coverage Note", accessor: 'note', Cell: (cell) => (highlighter(cell.value))},
    { Header: "Coverage Summary", id: 'coverage', accessor: 'coverage' },
  ]

  const filterGroups = {
  }
  
  return (
    <TriPanel
      left= { <Search className="w-100" app={props.app} filters={filterGroups} /> }
      center= { <UrlParamResourceSearch resource="PackageContentItem" fieldsToSearch={searchIn} columnDef={columns} app={props.app} /> }
    />
  )
})

export default hot(module)(KbEntries)
