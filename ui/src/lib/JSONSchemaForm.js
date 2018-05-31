import React from 'react'
import PropTypes from 'prop-types'
import Ajv from 'ajv'
import AutoForm from 'uniforms-bootstrap4/AutoForm'
import JSONSchemaBridge from 'uniforms/JSONSchemaBridge'
import { hot } from 'react-hot-loader'


const JSONSchemaForm = ({ schema, model }) => {
  
  const validator = new Ajv({allErrors: true, useDefaults: true}).compile(schema);
  const schemaValidator = model => {
    validator(model);

    if (validator.errors && validator.errors.length) {
      throw {details: validator.errors};
    }
  };
  const bridge = new JSONSchemaBridge(schema, schemaValidator);
  return <AutoForm schema={bridge} onSubmit={doc => console.log(doc)} model={model} />
}
  
export default hot(module)(JSONSchemaForm)