import React from 'react'
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'

// See http://ux.folio.org/docs/guidelines/components/modal/
import Modal from '@folio/stripes-components/lib/Modal';


// Observable property 
let isOpen = observable(false)

const AddActivity = observer(({app, open}) => {
  return (
    <Modal dismissable closeOnBackgroundClick open={open} label="Add to Agreement....">
      this is the add content to agreement modal
    </Modal>
  )
})

AddActivity.propTypes = {
  app: PropTypes.object,
  open: PropTypes.bool,
};


export default hot(module)(AddActivity)
