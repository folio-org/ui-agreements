import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import mirageOptions from '../network';

import findPOLineModule from './findPOLineModule';

export default function setupApplication({
  scenarios,
  hasAllPerms = true
} = {}) {
  setupStripesCore({
    mirageOptions: {
      serverType: 'miragejs',
      ...mirageOptions
    },
    modules: [
      findPOLineModule,
    ],
    scenarios,
    stripesConfig: {
      hasAllPerms
    }
  });
}
