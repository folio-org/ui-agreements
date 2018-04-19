import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import stringReplace from 'react-string-replace'

import ResourceBasedTable from './lib/resource/resource-based-table'
import {tableFormatters} from './lib/helpers'
import Nav from './layout/nav'

import { Container, Card, CardImg, CardText, CardHeader, CardBody, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';

const Dash = observer((props) => {
  
  return (
    <div>

      <Container fluid={true}>
	<Row>
	  ERM Dashboard
	</Row>
	<Row>
	  <Col sm="3">

  	    <Card>
	      <CardHeader>Agreements</CardHeader>
	      <CardBody>
	        <CardText>
	          You have <a href="/path/to/agreements">12 curerent agreements</a>
	        </CardText>
	      </CardBody>
	    </Card>

	    <br/>

  	    <Card>
	      <CardHeader>Upcoming Renewals</CardHeader>
	      <CardBody>
	        <CardText>No agreements ending within 8 weeks<br/>
	                  Click here to update settings.
	        </CardText>
	      </CardBody>
	    </Card>

	    <br/>

  	    <Card>
	      <CardHeader>Recently Edited Agreements</CardHeader>
	      <CardBody>
	      </CardBody>
	    </Card>

	  </Col>

	  <Col sm="3">
	    <Card>
	      <CardHeader>Subscribed Content</CardHeader>
	      <CardBody>
	        <CardText>Your current agreements provide access to
	                36455 individual electronic resources.</CardText>
	        <CardText>
	          Quick Search: <input name="q" type="text"/>
	        </CardText>
	      </CardBody>
	    </Card>

	  </Col>

	  <Col sm="3">

	    <Card>
	      <CardHeader>Packages</CardHeader>
	      <CardBody>
	        <CardText>You are currently selecting titles from 23 packages</CardText>
	      </CardBody>
	    </Card>
	  </Col>

	  <Col sm="3">

	    <Card>
	      <CardHeader>Licenses</CardHeader>
	      <CardBody>
	        <CardTitle>Your Licenses</CardTitle>
	      </CardBody>
	    </Card>

	    <br/>

  	    <Card>
	      <CardHeader>Recently Edited Licenses</CardHeader>
	      <CardBody>
	      </CardBody>
	    </Card>
	  </Col>

	</Row>

      </Container>
    </div>
  )
})

export default hot(module)(Dash)
