import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Link } from 'react-router-dom'

import { Container, Card, CardImg, CardText, CardHeader, CardBody, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';


const Dash = observer(({handleTriggerSync, app}) => {
  
  return (
    <div>
      <Container fluid={true}>
      	<Row>
      	  <Col sm="12"><h1>ERM Dashboard</h1></Col>
      	</Row>
      	<Row>
      	  <Col sm="3">
      
        	    <Card>
      	      <CardHeader>Agreements</CardHeader>
      	      <CardBody>
      	        <CardText>
      	          You have <Link to="/erm">12 curerent agreements</Link>. <br/>Workflows you can launch from here:
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
      	      <CardHeader>Subscribed Content</CardHeader>
      	      <CardBody>
      	        <CardText>Your current agreements provide access to
      	                36455 individual electronic resources.</CardText>
      	        <CardText>
      	          Quick Search: <input name="q" type="text"/>
                  <button className="btn btn-primary">Test</button>
      	        </CardText>
      	      </CardBody>
      	    </Card>
      
                  <br/>
      
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
      	        <CardText>You are currently selecting titles from 23 packages</CardText>
      	      </CardBody>
      	    </Card>

            <br/>

      	    <Card>
      	      <CardHeader>Admin</CardHeader>
      	      <CardBody>
      	        <CardText><button className="btn btn-primary" onClick={handleTriggerSync}>Trigger KB Sync</button></CardText>
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

Dash.propTypes = {
    handleTriggerSync: React.PropTypes.func,
    app: React.PropTypes.object,
};

export default hot(module)(Dash)
