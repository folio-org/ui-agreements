import React from 'react'
import PropTypes from 'prop-types'
import Ajv from 'ajv'
import AutoForm from 'uniforms-bootstrap4/AutoForm'
import { hot } from 'react-hot-loader'


import JSONSchemaBridge from './JSONSchemaBridge'


const JSONSchemaForm = ({ schema, model }) => {
  
  const validator = new Ajv({allErrors: true, useDefaults: true}).compile(schema)
  const schemaValidator = model => {
    validator(model);

    if (validator.errors && validator.errors.length) {
      throw {details: validator.errors};
    }
  }
  
//  let resolvedSchema = SchemaParser.parse(schema)
//  if (resolvedSchema.undefined) {
//    // Happens with root ref.
//    Object.assign(resolvedSchema, resolvedSchema.undefined)
//    delete resolvedSchema.undefined
//    delete resolvedSchema.$ref
//  }
  
//  console.log("Resolved schema", resolvedSchema)
  
  const bridge = new JSONSchemaBridge(schema, schemaValidator)
  return <AutoForm showInlineError={true} className="col-12" schema={bridge} onSubmit={doc => console.log(doc)} model={model} />
}
  
export default hot(module)(JSONSchemaForm)