import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import stringReplace from 'react-string-replace'

import ResourceBasedTable from './lib/resource/resource-based-table'
import {tableFormatters} from './lib/helpers'
import Nav from './layout/nav'


const Content = observer((props) => {

  let columns = [
    {
      Header: "Name",
      id: 'name',
      accessor: d => ({name: d.name, id: d.id}),
      Cell: tableFormatters.pipe( (cell) => (stringHighlighter(cell.value.name)), (previous, cell) => (<a href={`#${cell.value.id}`}>{previous}</a>) )
    },
    {
      Header:"Agreement",
      id:"agreementName",
      accessor: d => ({name: d.name, id: d.id})
    },
    {
      Header:"Package",
      id:"packageName",
      accessor: d => ({name: d.name, id: d.id})
    },
    {
      // Explanation - explain how the agreement line gives rise to the content - three options - be nice to have rollover explanation
      // of the three values
      //   1) Subscribed Package - There is an agreement line item for a package, and this title is in that package.
      //   2) Package Title - There is an agreement line item specifically for this title in this package
      //   2) Explicit Title - This title has been explicitly added to the agreement outside a packaging context
      Header:"Reason",
      id:"accessExplanation",
      accessor: d => ({name: d.name, id: d.id})
    },
    {
      Header:"Title",
      id:"title",
      accessor: d => ({name: d.name, id: d.id})
    },
    {
      Header:"Item Type",
      id:"itemType",
      accessor: d => ({name: d.name, id: d.id})
    }
  ]

  return (
    <div>
      <Container fluid={true}>
        <Row>
          <Col lg="3" xs="12" >
            <div>
              <h2>Search</h2>
	      ...
            </div>
            <div>
              <h2>Filters</h2>
            </div>
          </Col>
          <Col lg="9" xs="12" >
	    <ResourceBasedTable resource="SubscribedContent" columns={columns} app={props.app} />
	  </Col>
        </Row>
      </Container>
    </div>
  )

  
})

export default hot(module)(Content)
