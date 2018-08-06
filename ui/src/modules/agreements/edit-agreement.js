import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import JSONSchemaForm from '../../lib/forms/JSONSchemaForm'
import { Row, Container } from 'reactstrap'

const formSchema = {
    "$schema": "http://json-schema.org/schema#",
    "$id": "http://localhost:8080/kiwt/config/schema/embedded/SubscriptionAgreement",
    "title": "Subscription Agreement",
    "type": "object",
    "required": ["name"],
    "properties": {
      "name": {
        "type": "string"
      },
      "localReference": {
        "type": "string"
      },
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
      "version": {
        "type": "integer"
      },
      "enabled": {
        "type": "boolean"
      },
      "endDate": {
        "format": "date-time",
        "type": "string"
      },
      "items": {
        "type": "array",
        "items": {
          "anyOf": [{
            "$ref": "#/definitions/AgreementLineItem"
          }, {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            }
          }]
        }
      },
      "agreementType": {
        "anyOf": [{
          "$ref": "#/definitions/RefdataValue"
        },{
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          }
        }]
      }
    },
    "definitions": {
      "AgreementLineItem": {
        "type": "object",
        "required": ["owner"],
        "properties": {
          "pci": {
            "anyOf": [{
              "$ref": "#/definitions/PackageContentItem"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          },
          "activeTo": {
            "format": "date-time",
            "type": "string"
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
              "anyOf": [{
                "$ref": "#/definitions/HoldingsCoverage"
              }, {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              }]
            }
          },
          "pti": {
            "anyOf": [{
              "$ref": "#/definitions/PlatformTitleInstance"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          },
          "pkg": {
            "anyOf": [{
              "$ref": "#/definitions/Package"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
            "anyOf": [{
              "$ref": "#/definitions/PlatformTitleInstance"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          },
          "pkg": {
            "anyOf": [{
              "$ref": "#/definitions/Package"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          }
        }
      },
      "PlatformTitleInstance": {
        "type": "object",
        "required": ["titleInstance", "platform"],
        "properties": {
          "titleInstance": {
            "anyOf": [{
              "$ref": "#/definitions/TitleInstance"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          },
          "platform": {
            "anyOf": [{
              "$ref": "#/definitions/Platform"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
              "anyOf": [{
                "$ref": "#/definitions/IdentifierOccurrence"
              }, {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
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
            "anyOf": [{
              "$ref": "#/definitions/TitleInstance"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          },
          "status": {
            "anyOf": [{
              "$ref": "#/definitions/RefdataValue"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
            }]
          },
          "version": {
            "type": "integer"
          },
          "identifier": {
            "anyOf": [{
              "$ref": "#/definitions/Identifier"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
            "anyOf": [{
              "$ref": "#/definitions/RefdataCategory"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
            "anyOf": [{
              "$ref": "#/definitions/IdentifierNamespace"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
              "anyOf": [{
                "$ref": "#/definitions/IdentifierOccurrence"
              }, {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
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
      "SubscriptionAgreement": {
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
              "anyOf": [{
                "$ref": "#/definitions/AgreementLineItem"
              }, {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
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
            "anyOf": [{
              "$ref": "#/definitions/RefdataValue"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
            "anyOf": [{
              "$ref": "#/definitions/AgreementLineItem"
            }, {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              }
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
