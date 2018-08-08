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

const PurchaseActivity = observer(({app}) => {

  return (
    <Paneset>
      <Pane defaultWidth="fill" paneTitle="Purchase Activity">
        Purchase....
      </Pane>
    </Paneset>
  )
})

Pci.propTypes = {
    app: React.PropTypes.object,
};


export default hot(module)(PurchaseActivity)
