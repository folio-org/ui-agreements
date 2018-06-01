import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import JSONSchemaForm from '../../lib/forms/JSONSchemaForm'
import { Row, Container } from 'reactstrap'

const formSchema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Subscription Agreement",
  "$ref": "#/definitions/SubscriptionAgreement",
  "definitions": {
    "SubscriptionAgreement": {
      "id": "http://localhost:8080/kiwt/config/schema/embedded/SubscriptionAgreement",
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
            "oneOf": [{
              "type": "string"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }, {
              "$ref": "#/definitions/AgreementLineItem"
            }]
          }
        },
        "name": {
          "type": "string"
        },
        "localReference": {
          "type": "string"
        },
        "agreementType": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/RefdataValue"
          }]
        },
        "version": {
          "type": "integer"
        },
        "enabled": {
          "type": "boolean"
        },
        "endDate": {
          "format": "date-time",
          "type": "string"
        }
      }
    },
    "AgreementLineItem": {
      "type": "object",
      "properties": {
        "pci": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/PackageContentItem"
          }]
        },
        "activeTo": {
          "format": "date-time",
          "type": "string"
        },
        "owner": {
          "$ref": "#/definitions/SubscriptionAgreement"
        },
        "activeFrom": {
          "format": "date-time",
          "type": "string"
        },
        "version": {
          "type": "integer"
        },
        "coverage": {
          "type": "array",
          "items": {
            "oneOf": [{
              "type": "string"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }, {
              "$ref": "#/definitions/HoldingsCoverage"
            }]
          }
        },
        "pti": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/PlatformTitleInstance"
          }]
        },
        "pkg": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/Package"
          }]
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
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/PlatformTitleInstance"
          }]
        },
        "pkg": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/Package"
          }]
        }
      }
    },
    "PlatformTitleInstance": {
      "type": "object",
      "required": ["titleInstance", "platform"],
      "properties": {
        "titleInstance": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/TitleInstance"
          }]
        },
        "platform": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/Platform"
          }]
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
            "oneOf": [{
              "type": "string"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }, {
              "$ref": "#/definitions/IdentifierOccurrence"
            }]
          }
        }
      }
    },
    "IdentifierOccurrence": {
      "type": "object",
      "required": ["status", "identifier"],
      "properties": {
        "title": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/TitleInstance"
          }]
        },
        "status": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/RefdataValue"
          }]
        },
        "version": {
          "type": "integer"
        },
        "identifier": {
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/Identifier"
          }]
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
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/RefdataCategory"
          }]
        },
        "version": {
          "type": "integer"
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
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/IdentifierNamespace"
          }]
        },
        "value": {
          "type": "string"
        },
        "version": {
          "type": "integer"
        },
        "occurrences": {
          "type": "array",
          "items": {
            "oneOf": [{
              "type": "string"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }, {
              "$ref": "#/definitions/IdentifierOccurrence"
            }]
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
        },
        "version": {
          "type": "integer"
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
          "oneOf": [{
            "type": "string"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }, {
            "$ref": "#/definitions/AgreementLineItem"
          }]
        },
        "endIssue": {
          "type": "string"
        },
        "startVolume": {
          "type": "string"
        },
        "version": {
          "type": "integer"
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

const EditAgreement = ( {match: { params : {resourceId} }}) => {
  
  if (resourceId === 'new') {
    console.log(`${resourceId}`)
  }
  
  return (
    <Container fluid >
      <Row>
        <JSONSchemaForm grid="16" schema={formSchema} onSubmit={doc => console.log(doc)} />
      </Row>
    </Container>
  )
}
  
export default hot(module)(EditAgreement)
