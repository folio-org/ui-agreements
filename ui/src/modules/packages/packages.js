import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'

import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';

import { Link } from 'react-router-dom'



let searchIn = [
  '__cql'
]


const Packages = observer(({onTest, showFilterPane, showDetailPane, handleCloseFilter, handleCloseDetail, handleSelectPCI, app}) => {

  const columns = [
    { Header: "Package Name", id: 'name', accessor: 'name' },
  ]

  const filterGroups = {
  }


  return (
    <Paneset>
      {
        showFilterPane &&
        <Pane defaultWidth="20%" dismissible paneTitle="KB Filters" onClose={handleCloseFilter}>
          KB Query
          <input type="text" name="KBQuery"/>
          <button type="submit" className="btn btn-primary">Go</button>
          
        </Pane>
      }
      <Pane defaultWidth="fill" paneTitle="KB Titles">
        <UrlParamResourceSearch resource="Package" fieldsToSearch={searchIn} columnDef={columns} app={app} />
      </Pane>
      {
        showDetailPane &&
        <Pane defaultWidth="40%" dismissible paneTitle="Details" onClose={handleCloseDetail}>
          <button className="btn btn-primary" onClick={onTest}>Test</button>
        </Pane>
      }
    </Paneset>
  )
})

Packages.propTypes = {
    onTest: React.PropTypes.func,
    showFilterPane: React.PropTypes.bool,
    handleCloseFilter: React.PropTypes.func,
    showDetailPane: React.PropTypes.bool,
    handleCloseDetail: React.PropTypes.func,
    handleSelectPCI: React.PropTypes.func,
    app: React.PropTypes.object,
};


export default hot(module)(Packages)
