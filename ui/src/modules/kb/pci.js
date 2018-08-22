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

const Pci = observer(({app, selectedDetailRecord}) => {

  return (
    <div>
      <ul>
        <li>pci_id: {selectedDetailRecord.pci_id}</li>
        <li>coverage: {selectedDetailRecord.coverage}</li>
        <li>coverageDepth: {selectedDetailRecord.coverageDepth}</li>
        <li>coverageNote: {selectedDetailRecord.coverageNote}</li>
        <li>dateAdded: {selectedDetailRecord.dateAdded}</li>
        <li>dateRemoved: {selectedDetailRecord.dateRemoved}</li>
        <li>package_id: {selectedDetailRecord.package_id}</li>
        <li>package_kb: {selectedDetailRecord.package_kb}</li>
        <li>package_name: {selectedDetailRecord.package_name}</li>
        <li>package_source: {selectedDetailRecord.package_source}</li>
        <li>platform: {selectedDetailRecord.platform}</li>
        <li>platform_id: {selectedDetailRecord.platform_id}</li>
        <li>title: {selectedDetailRecord.title}</li>
        <li>title_id: {selectedDetailRecord.title_id}</li>
      </ul>
      <button className="btn btn-primary">Test</button>
      <button className="btn btn-primary">Purchase</button>
      <button className="btn btn-primary">Add to Agreement</button>
    </div>
  )
})

Pci.propTypes = {
    selectedDetailRecord: React.PropTypes.object,
    app: React.PropTypes.object,
};


export default hot(module)(Pci)
