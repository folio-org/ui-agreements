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


let searchIn = [
  '__cql'
]


const Kb = observer(({onTest, showPane, handleClose, app}) => {

  const columns = [
    {
      Header: "Id",
      id: 'id',
      accessor: 'id'
    }
  ]

  const filterGroups = {
  }


  return (
    <Paneset>
      {
        showPane &&
        <Pane defaultWidth="20%" dismissible paneTitle="KB Filters" onClose={handleClose}>
          KB Query
          <input type="text" name="KBQuery"/>
          <button type="submit" className="btn btn-primary">Go</button>
          
        </Pane>
      }
      <Pane defaultWidth="fill" paneTitle="KB Titles">
        // Pane Content
        <button className="btn btn-primary" onClick={onTest}>Test</button>
        <UrlParamResourceSearch resource="PackageContentItem" fieldsToSearch={searchIn} columnDef={columns} app={app} />
      </Pane>
    </Paneset>
  )
})

Kb.propTypes = {
    onTest: React.PropTypes.func,
    showPane: React.PropTypes.bool,
    handleClose: React.PropTypes.func,
    app: React.PropTypes.object,
};


export default hot(module)(Kb)
