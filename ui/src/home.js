import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import app from './lib/folio-stripes/app'
import { hot } from 'react-hot-loader'
import ResourceBasedTable from './lib/resource/resource-based-table'
import {tableFormatters} from './lib/helpers'
import Nav from './layout/nav'
import { Container, Row, Col } from 'reactstrap'

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

const Home = observer(() => {
  return (
    <div>
      <Nav />
      <Container fluid={true}>
        <Row>
          <Col md="3" xs="12" ><h2>Filters</h2></Col>
          <Col md="9" xs="12" ><ResourceBasedTable resourceType="SubscriptionAgreement" columns={columns} app={app} /></Col>
        </Row>
      </Container>
    </div>
  )
})

export default hot(module)(Home)
