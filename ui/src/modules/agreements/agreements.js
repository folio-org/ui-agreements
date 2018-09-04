import React from 'react'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Link } from 'react-router-dom'

import ResourceCRUD from '../../lib/resource/resource-based-crud'
import {tableFormatters, textHighlighter} from '../../lib/helpers'
import ViewAgreementComponent from './ViewAgreementComponent'

let searchIn = [
  'name',
  'agreementType.label'
]

const Agreements = observer((props) => {
  
  const highlighter = textHighlighter ( () => (props.app.queryStringObject.term))

  const columns = [
    {
      Header: "Name",
      id: 'name',
      accessor: d => ({name: d.name, id: d.id}),
      Cell: tableFormatters.pipe( (cell) => (highlighter(cell.value.name)), (previous, cell) => (<Link to={`/${cell.value.id}`}>{previous}</Link>) )
    },{
      Header: "Subscription",
      columns:[{
        Header: "Agreement Type",
        accessor: "agreementType.label",
        Cell: (cell) => (highlighter(cell.value))
      },{
        Header: "Start Date",
        accessor: "startDate",
        Cell: tableFormatters.date
      },{
        Header: "End Date",
        accessor: "endDate",
        Cell: tableFormatters.date
      }]
    },{
      Header: "Renewal Date",
      accessor: "renewalDate",
      Cell: tableFormatters.date
    },{
      Header: "Next Review Date",
      accessor: "nextReviewDate",
      Cell: tableFormatters.date
    }
  ]

  const filterGroups = {
    'agreementType.value' : {
      text: 'Agreement Type',
      filters: {
        'trial': {
          text: 'Trial'
        },
        'draft': {
          text: 'Draft'
        }
      }
    }
  }
  
  return (
    <ResourceCRUD viewPanelComponent={ViewAgreementComponent} filterGroups={filterGroups} searchIn={searchIn} columnDef={columns} app={props.app} resource="SubscriptionAgreement" />
  )
})

export default hot(module)(Agreements)

