import JSONSchemaBridge from 'uniforms/JSONSchemaBridge'
import joinName  from 'uniforms/joinName'
import invariant from 'fbjs/lib/invariant'

export default class ExtendedJSONSchemaBridge extends JSONSchemaBridge {
  
  ext
  
  constructor (schema, validator, extension = {}) {
    super(schema, validator)
    this.ext = extension
  }

  resolveRef = (ref, schema) => {
    invariant(
      ref.startsWith('#'),
      'Reference is not an internal reference, and only such are allowed: "%s"',
      ref
    )
    
    const parts = ref.split('/')

    const resolvedReference = parts
      .filter(part => part && part !== '#')
      .reduce((definition, next) => definition[next], schema)

    invariant(resolvedReference, 'Reference not found in schema: "%s"', ref)


    if (resolvedReference) {
      resolvedReference.isRef = true
      resolvedReference.refType = parts[parts.length - 1]
    }
    
    return resolvedReference;
  }
  
  getField = (name) => {
    let fieldDef =  joinName(null, name).reduce(
        (definition, next, nextIndex, array) => {
          const previous = joinName(array.slice(0, nextIndex))
          const isRequired = (
            definition.required || (this._compiledSchema[previous] || {}).required || []
          ).includes(next)
          
          const _key = joinName(previous, next);
          const _definition = this._compiledSchema[_key] || {}
          
          if (next === '$' || next === '' + parseInt(next, 10)) {
            invariant(definition.type === 'array', 'Field not found in schema: "%s"', name)
            definition = Array.isArray(definition.items)
              ? definition.items[parseInt(next, 10)]
              : definition.items
          } else if (definition.type === 'object') {
            definition = definition.properties[next]
          } else {
            let filtered = ['allOf', 'anyOf', 'oneOf'].filter(key => definition[key]).map(key =>
                definition[key].find((obj) => {
                  
                  // Resolve any refs.
                  if (obj.$ref) {
                    let ref = this.resolveRef(obj.$ref, this.schema)
                    
                    // Also append to the object.
                    Object.assign(obj, ref)
                  }
                  
                  let properties = obj.properties || {}
                  return properties[next]
                })
              )
            const [{properties: combinedDefinition = {}} = {}] = filtered  
            definition = combinedDefinition[next]
          }
          
          invariant(definition, 'Field not found in schema: "%s"', name)
          
          if (definition.$ref) {
            definition = this.resolveRef(definition.$ref, this.schema)
          }
          
          ['allOf', 'anyOf', 'oneOf'].filter(key => definition[key]).forEach(key => {
            _definition[key] = definition[key].map(def => def.$ref ? this.resolveRef(def.$ref, this.schema) : def)
          })
          
          // Naive computation of combined type, properties and required
          if (['allOf', 'anyOf', 'oneOf'].filter(key => definition[key]).length) {
            _definition.type = (
              [].concat(_definition.allOf, _definition.anyOf, _definition.oneOf)
                .filter(def => def)
                .find(def => def.type)
              || {}
            ).type
            const [properties, required] = [].concat(_definition.allOf, _definition.anyOf, _definition.oneOf)
            .filter(def => def)
            .reduce(
               ([_properties, _required], {properties, required}) => ([
                 Object.assign(_properties, properties), _required.concat(required)
               ]),
               [{}, []]
            )
            
            _definition.properties = properties
            _definition.required = required
          }
          
          this._compiledSchema[_key] = Object.assign(_definition, {isRequired})
          
          return definition
        },
        this.schema
    )
    
    this.extend(name, fieldDef)
    return fieldDef
  }
  
  extend = (name, currentDef) => {
    
    if (currentDef && name) {
      
      let extras = {}
      const ext = this.ext
      
      // Check type section for referenced type and pure type.
      if (ext.types) {
        let typeExtras = currentDef.refType ? ext.types[currentDef.refType] : null
        if (typeExtras) {
          // Lookup from the type.
          Object.assign (extras, typeExtras)
        }
      }
      
      // Check for field key.
      if (ext.fields) {
        let nameExtras = name ? ext.fields[name] : null
        if (nameExtras) {
          // Lookup from the type.
          Object.assign (extras, nameExtras)
        }
      }
      
      Object.assign(currentDef, extras)
    }
  }
  
//  getProps = (name, {label = true, options: opts, placeholder, ...props} = {}) => {
//    let fieldProps = super.getProps(name, {label, opts, placeholder, ...props})
//    
//    console.log(`gp: ${name}: `, fieldProps)
//    return fieldProps
//  }
    
//  getType = (name) => {
//    let theType = super.getType(name)
//    console.log(`gt: ${name}: `, theType)
//    return theType
//  }
  
  getSubfields (name) {
    let subfields = super.getSubfields(name)
    
    console.log(`gsf: ${name}: `, subfields)
    return subfields
  }
}