import React from 'react'
import Agreements from './agreements'

class AgreementsModule {
  
  get mainNav() {
    return true
  }
  
  /**
   * Returns object that represents a map of 'routePath', which is relative to this app, to other Router props.
   */
  get routes() {
    return {
      '/agreements/:resourceId?' : {
        render: ({app}) => (() => ( <Agreements app={app} /> ))
      }
    }
  }
}

export default AgreementsModule;