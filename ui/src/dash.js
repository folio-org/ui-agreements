import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import stringReplace from 'react-string-replace'

import {tableFormatters} from './lib/helpers'
import Nav from './layout/nav'
import { Link } from 'react-router-dom'

import { Container, Card, CardImg, CardText, CardHeader, CardBody, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';

const Dash = observer((props) => {
  
  return (
    <div>

      <Container fluid={true}>
	<Row>
	  <Col sm="12"><h1>ERM Dashboard</h1></Col>
	</Row>
	<Row>
	  <Col sm="12">

	    <Card>
	      <CardHeader>Subscribed Content</CardHeader>
	      <CardBody>
	        <CardText>You have 12 current agreements which provide access to
	                36455 individual electronic resources drawn from 123 packages.</CardText>
	        <CardText>
	          Search currently available e-resources: <input name="q" type="text"/>
	        </CardText>
	      </CardBody>
	    </Card>

	  </Col>
	</Row>
	<Row>
	  <Col sm="3">

  	    <Card>
	      <CardHeader>Agreements</CardHeader>
	      <CardBody>
	        <CardText>
	          You have <Link to="/erm/home">12 curerent agreements</Link>. <br/>Workflows you can launch from here:
	        </CardText>
	          <ul>
	            <li>Create a new empty agreement and add content later</li>
	            <li>Search packages and create a draft, trial or live agreement</li>
	          </ul>
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
	      <CardHeader>Content Issues</CardHeader>
	      <CardBody>
	        <CardText>
	          There are currently no reported issues accessing
	          electronic content. The world is happy.
	        </CardText>
	      </CardBody>
	    </Card>


	  </Col>

	  <Col sm="3">

	    <Card>
	      <CardHeader>Packages</CardHeader>
	      <CardBody>
	        <CardText>You are <Link to="/erm/packages">currently selecting titles from 2</Link> out of <Link to="/erm/packages">2 available packages</Link> packages</CardText>
	      </CardBody>
	    </Card>
	  </Col>

	  <Col sm="3">

	    <Card>
	      <CardHeader>Licenses</CardHeader>
	      <CardBody>
	        <CardText>Your Licenses</CardText>
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
