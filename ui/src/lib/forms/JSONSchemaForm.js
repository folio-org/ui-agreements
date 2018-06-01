import React from 'react'
import PropTypes from 'prop-types'
import Ajv from 'ajv'
import AutoForm from 'uniforms-bootstrap4/AutoForm'
import AutoField from 'uniforms-bootstrap4/AutoField'
import SubmitField from 'uniforms-bootstrap4/SubmitField'
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
  const bridge = new JSONSchemaBridge(schema, schemaValidator, {
    
    types : {
      "RefdataValue" : {
        "type": 'string'
      }
    }
    
  })
  return <AutoForm className="col-12" schema={bridge} onSubmit={doc => console.log(doc)} model={model} />
}
  
export default hot(module)(JSONSchemaForm)