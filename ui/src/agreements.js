import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'

import UrlParamResourceCrud from './lib/resource/url-param-resource-crud'
import {tableFormatters, textHighlighter} from './lib/helpers'
import Nav from './layout/nav'

let searchIn = [
  'name',
  'agreementType.label'
]

const Home = observer((props) => {
  
  let highlighter = textHighlighter ( () => (props.app.queryStringObject.term))

  let columns = [
    {
      Header: "Name",
      id: 'name',
      accessor: d => ({name: d.name, id: d.id}),
      Cell: tableFormatters.pipe( (cell) => (highlighter(cell.value.name)), (previous, cell) => (<a href={`#${cell.value.id}`}>{previous}</a>) )
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
  
  return (
    <div>
      <Nav app={props.app} />
      <Container fluid={true}>
        <Row>
          <Col lg="3" xs="12" >
            <div className="position-fixed" >
              <h2>Filters</h2>
            </div>
          </Col>
          <Col lg="9" xs="12" ><UrlParamResourceCrud resource="SubscriptionAgreement" fieldsToSearch={searchIn} columnDef={columns} app={props.app} /></Col>
        </Row>
      </Container>
    </div>
  )
})

export default hot(module)(Home)
