import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import JSONSchemaForm from '../../lib/JSONSchemaForm'

const formSchema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Subscription Agreement",
  "type": "object",
  "required": ["name"],
  "properties": {
    "vendorReference": {
      "type": "string"
    },
    "startDate": {
      "format": "date-time",
      "type": "string"
    },
    "renewalDate": {
      "format": "date-time",
      "type": "string"
    },
    "nextReviewDate": {
      "format": "date-time",
      "type": "string"
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/AgreementLineItem"
      }
    },
    "name": {
      "type": "string"
    },
    "localReference": {
      "type": "string"
    },
    "agreementType": {
      "$ref": "#/definitions/RefdataValue"
    },
    "enabled": {
      "type": "boolean"
    },
    "endDate": {
      "format": "date-time",
      "type": "string"
    }
  },
  "definitions": {
    "AgreementLineItem": {
      "type": "object",
      "properties": {
        "pci": {
          "$ref": "#/definitions/PackageContentItem"
        },
        "activeTo": {
          "format": "date-time",
          "type": "string"
        },
        "activeFrom": {
          "format": "date-time",
          "type": "string"
        },
        "coverage": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/HoldingsCoverage"
          }
        },
        "pti": {
          "$ref": "#/definitions/PlatformTitleInstance"
        },
        "pkg": {
          "$ref": "#/definitions/Package"
        },
        "enabled": {
          "type": "boolean"
        }
      }
    },
    "PackageContentItem": {
      "type": "object",
      "required": ["pti", "pkg"],
      "properties": {
        "accessStart": {
          "format": "date-time",
          "type": "string"
        },
        "accessEnd": {
          "format": "date-time",
          "type": "string"
        },
        "depth": {
          "type": "string"
        },
        "note": {
          "type": "string"
        },
        "version": {
          "type": "integer"
        },
        "pti": {
          "$ref": "#/definitions/PlatformTitleInstance"
        },
        "pkg": {
          "$ref": "#/definitions/Package"
        }
      }
    },
    "PlatformTitleInstance": {
      "type": "object",
      "required": ["titleInstance", "platform"],
      "properties": {
        "titleInstance": {
          "$ref": "#/definitions/TitleInstance"
        },
        "platform": {
          "$ref": "#/definitions/Platform"
        },
        "version": {
          "type": "integer"
        }
      }
    },
    "TitleInstance": {
      "type": "object",
      "required": ["title"],
      "properties": {
        "title": {
          "type": "string"
        },
        "version": {
          "type": "integer"
        },
        "identifiers": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/IdentifierOccurrence"
          }
        }
      }
    },
    "IdentifierOccurrence": {
      "type": "object",
      "required": ["status", "identifier"],
      "properties": {
        "title": {
          "$ref": "#/definitions/TitleInstance"
        },
        "status": {
          "$ref": "#/definitions/RefdataValue"
        },
        "version": {
          "type": "integer"
        },
        "identifier": {
          "$ref": "#/definitions/Identifier"
        }
      }
    },
    "RefdataValue": {
      "type": "object",
      "required": ["value", "owner"],
      "properties": {
        "style": {
          "type": "string"
        },
        "value": {
          "type": "string",
          "minLength": 0
        },
        "owner": {
          "$ref": "#/definitions/RefdataCategory"
        },
        "label": {
          "type": "string"
        }
      }
    },
    "RefdataCategory": {
      "type": "object",
      "required": ["desc"],
      "properties": {
        "desc": {
          "type": "string",
          "minLength": 0
        },
        "version": {
          "type": "integer"
        }
      }
    },
    "Identifier": {
      "type": "object",
      "required": ["ns", "value"],
      "properties": {
        "ns": {
          "$ref": "#/definitions/IdentifierNamespace"
        },
        "value": {
          "type": "string"
        },
        "occurrences": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/IdentifierOccurrence"
          }
        }
      }
    },
    "IdentifierNamespace": {
      "type": "object",
      "required": ["value"],
      "properties": {
        "value": {
          "type": "string"
        },
        "version": {
          "type": "integer"
        }
      }
    },
    "Platform": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": {
          "type": "string"
        }
      }
    },
    "Package": {
      "type": "object",
      "required": ["name", "source", "reference"],
      "properties": {
        "name": {
          "type": "string"
        },
        "version": {
          "type": "integer"
        },
        "source": {
          "type": "string"
        },
        "reference": {
          "type": "string"
        }
      }
    },
    "HoldingsCoverage": {
      "type": "object",
      "properties": {
        "startDate": {
          "type": "string"
        },
        "startIssue": {
          "type": "string"
        },
        "ali": {
          "$ref": "#/definitions/AgreementLineItem"
        },
        "endIssue": {
          "type": "string"
        },
        "startVolume": {
          "type": "string"
        },
        "endVolume": {
          "type": "string"
        },
        "endDate": {
          "type": "string"
        }
      }
    }
  }
}

const EditAgreement = ({ resourceId: {params : resourceId }}) => {
  
  if (resourceId === 'new') {
    console.log(`${resourceId}`)
  }
  
  return (<JSONSchemaForm schema={formSchema} onSubmit={doc => console.log(doc)} />)
}
  
export default hot(module)(EditAgreement)
