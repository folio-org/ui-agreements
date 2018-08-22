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

import { Link } from 'react-router-dom';

import PciComponent from './pciComponent';


//Import activities that can be triggered on selected rows
import AddToAgreementActivity from '../activities/addActivityComponent';

const searchIn = [
  'pti.titleInstance.title',
  'pkg.remoteKb.name',
  'pti.platform.name',
  'pkg.name',
  'pkg.source',
  'depth',
  'note'
]

const Kb = observer(({showFilterPane, 
  showDetailPane, 
  selectedDetailRecord, 
  handleCloseFilter, 
  handleCloseDetail, 
  kbTableRowClicked,
  selection,
  detailPaneContent,
  currentActivity,
  startActivity,
  app}) => {
    
    // Grab a highlighter that will highlight the current search term.
    const highlighter = textHighlighter ( () => (app.queryStringObject.term))
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
        <Paneset>
          {
            showFilterPane &&
            <Pane defaultWidth="20%" dismissible paneTitle="KB Filters" onClose={handleCloseFilter}>
              <Search className="w-100" app={app} filters={filterGroups} />
            </Pane>
          }
        <Pane defaultWidth="fill" paneTitle="KB Titles">
	  <div  className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => { startActivity('addToAgreement') }} >Add to aggreement</button>
	  </div>
          <UrlParamResourceSearch resource="PackageContentItem" 
            fieldsToSearch={searchIn} 
            columnDef={columns} 
            app={app} 
            handleRowClicked={kbTableRowClicked}
            keyField="id"
            selection={selection} />

          <AddToAgreementActivity app={app} currentActivity={currentActivity} />
        </Pane>
        {
		 
          showDetailPane && ( 
            <Pane defaultWidth="40%" dismissible paneTitle="Details" onClose={handleCloseDetail}>

            { (detailPaneContent == 'pciComponent') && ( <PciComponent app={app} selectedDetailRecord={selectedDetailRecord} /> ) }
            { (detailPaneContent == 'currentSelectionComponent') && (<div>Include the Current Selection pane</div>)}
            { (detailPaneContent == 'package') && (<div>Include the Package Selection pane</div>)}
            </Pane>
          )
        }
        </Paneset>
    )
  })
  
  Kb.propTypes = {
  showFilterPane: React.PropTypes.bool,
  showDetailPane: React.PropTypes.bool,
  handleCloseFilter: React.PropTypes.func,
  handleCloseDetail: React.PropTypes.func,
  selectedDetailRecord: React.PropTypes.object,
  kbTableRowClicked: React.PropTypes.func,
  selection: React.PropTypes.array,
  detailPaneContent: React.PropTypes.string,
  currentActivity: React.PropTypes.string,
  startActivity: React.PropTypes.func,
  app: React.PropTypes.object,
};


export default hot(module)(Kb)
