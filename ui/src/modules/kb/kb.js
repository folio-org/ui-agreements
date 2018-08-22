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
  'pti.titleInstance.title'
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
    
    const columns = [
       // { Header: "Title ID", id: 'title_id', accessor: 'title_id' },
       // { Header: "Source KB", id: 'kb', accessor: 'package_kb' },
       // { Header: "Id", id: 'id', accessor: 'pci_id' },
       { Header: "KB", id: 'PackageKB', accessor: 'package_kb' },
       { Header: "Title", id: 'title',
         // Construct a new json object to represent the cell value containing the ID and the title
         accessor: d => ({title: d.title, title_id: d.title_id}),
         // Construct a renderer that creates a href and renders a link
         Cell: (cell) => (<Link to={`/olf-erm/titles/${cell.value.title_id}`}>{cell.value.title}</Link>)
       },
       { Header: "Platform", id: 'platform', accessor: 'platform' },
       { Header: "Source", id: 'source', accessor: 'package_source' },
       { Header: "Package", id: 'package_name', accessor: 'package_name',
         accessor: d => ({pkgName: d.package_name, pkgId: d.package_id}),
         Cell: (cell) => (<Link to={`/olf-erm/packages/${cell.value.pkgId}`}>{cell.value.pkgName}</Link>)
       },
       { Header: "Coverage Depth", id: 'coverageDepth', accessor: 'coverageDepth' },
       { Header: "Coverage Note", id: 'coverageNote', accessor: 'coverageNote' },
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
          <button className="btn btn-primary" onClick={() => { startActivity('addToAgreement') }} >Test</button>
          <UrlParamResourceSearch resource="PackageContentItem" 
            fieldsToSearch={searchIn} 
            columnDef={columns} 
            app={app} 
            handleRowClicked={kbTableRowClicked}
            keyField="pci_id"
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
