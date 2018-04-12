import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import app from './lib/folio-stripes/app'
import { hot } from 'react-hot-loader'
import ResourceBasedTable from './lib/resource/resource-based-table'

let columns = [
  {
    Header: "Name",
    id: 'name',
    accessor: d => ({name: d.name, id: d.id}),
    Cell: cell => (<a href={`#${cell.value.id}`}>{cell.value.name}</a>)
  },{
    Header: "Subscription",
    columns:[{
      Header: "Agreement Type",
      accessor: "agreementType.value"
    },{
      Header: "Start Date",
      accessor: "startDate"
    },{
      Header: "End Date",
      accessor: "endDate"
    }]
  },{
    Header: "Renewal Date",
    accessor: "renewalDate" 
  },{
    Header: "Next Review Date",
    accessor: "nextReviewDate" 
  }
]

const Home = observer(() => {
  return (
    <div>
      <ResourceBasedTable resourceType="SubscriptionAgreement" columns={columns} app={app} />
    </div>
  )
})

export default hot(module)(Home)
