import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'

import UrlParamResourceCrud from '../../lib/resource/url-param-resource-crud'
import {tableFormatters, textHighlighter} from '../../lib/helpers'

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
    <Container fluid={true}>
      <Row>
        <Col lg="3" xs="12" className="position-fixed" >
          <Search className="w-100" app={props.app} filters={filterGroups} />
        </Col>
        <Col lg={{size:9, offset:3}} xs="12">
          <UrlParamResourceCrud resource="SubscriptionAgreement" fieldsToSearch={searchIn} columnDef={columns} app={props.app} />
        </Col>
      </Row>
    </Container>
  )
})

export default hot(module)(Agreements)
