import React from 'react';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom';
import { AccordionSet, Accordion } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import AgreementLines from './AgreementLines.js';

const ViewAgreement = observer(( { current, entitlements } ) => {

	return (
	<div>
      	<h1>{ current.name }</h1>
        <AccordionSet>
		  <Accordion label="Agreement information" id="ag-1">
			 <KeyValue
			  label="Some label"
			  value="Some value" />
             <KeyValue label="Description" value={ current.description } />
		  </Accordion>
  <Accordion label="Agreement lines" id="ag-2">
    <AgreementLines entitlements={ entitlements }/>
  </Accordion>
   <Accordion label="License" id="ag-3">
    <p>Accordion content!</p>
  </Accordion>
   <Accordion label="License and business terms" id="ag-4">
    <p>Accordion content!</p>
  </Accordion>
   <Accordion label="Organizations" id="ag-5">
    <p>Accordion content!</p>
  </Accordion>
   <Accordion label="E-resources" id="ag-6">
    <p>Accordion content!</p>
  </Accordion>
   <Accordion label="Associated agreements" id="ag-7">
    <p>Accordion content!</p>
  </Accordion>
</AccordionSet>
	</div>
  )
})
export default hot(module) (ViewAgreement)
