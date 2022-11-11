// FIXME currently since erm-testing exports TestForm using stripes-components, we have an issue
import { mockReactRouterDom } from '@folio/stripes-erm-testing/jest/mocks';

module.exports = {
  ...jest.requireActual('react-router-dom'),
  ...mockReactRouterDom
};
