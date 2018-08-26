import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'

import UrlParamResourceSearch from '../../lib/resource/url-param-resource-search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'



// See http://ux.folio.org/docs/guidelines/components/modal/
import Modal from '@folio/stripes-components/lib/Modal';


// Observable property
let isOpen = observable(false)

const PurchaseActivity = observer(({app, open}) => {
  return (
    <Modal dismissable closeOnBackgroundClick open={open} label="Purchase....">
      Purchase the selected items
    </Modal>
  )
})

AddActivity.propTypes = {
  app: PropTypes.object,
  open: PropTypes.bool,
};


export default hot(module)(PurchaseActivity)

