import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import { beforeEach } from '@bigtest/mocha';
import { unmountTestingRoot } from '@folio/stripes-erm-components';
import mirageOptions from '../network';
import findPOLineModule from './findPOLineModule';

export default function setupApplication({
  scenarios,
  hasAllPerms = true
} = {}) {
  beforeEach(async () => unmountTestingRoot());
  setupStripesCore({
    mirageOptions,
    modules: [
      findPOLineModule,
    ],
    scenarios,
    stripesConfig: {
      hasAllPerms
    }
  });
}
