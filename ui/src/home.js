import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import app from './lib/folio-stripes/app'
import { hot } from 'react-hot-loader'
import ResourceBasedTable from './lib/resource/resource-based-table'

let formatters = {
  date :cell => (cell.value ? new Date(cell.value).toLocaleDateString() : '')
}

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
      accessor: "startDate",
      Cell: formatters.date
    },{
      Header: "End Date",
      accessor: "endDate",
      Cell: formatters.date
    }]
  },{
    Header: "Renewal Date",
    accessor: "renewalDate",
    Cell: formatters.date
  },{
    Header: "Next Review Date",
    accessor: "nextReviewDate",
    Cell: formatters.date
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
