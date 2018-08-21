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


import Modal from '@folio/stripes-components/lib/Modal';

const AddActivity = observer(({app, show}) => {

  return (
    <Modal dismissable closeOnBackgroundClick show={show} label="Add to Agreement....">
      this is the add content to agreement modal
    </Modal>
  )
})

AddActivity.propTypes = {
    app: React.PropTypes.object,
    show: React.PropTypes.bool,
};


export default hot(module)(AddActivity)
