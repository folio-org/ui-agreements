import { mockKintComponents } from '@folio/stripes-erm-testing/jest/mocks';

module.exports = {
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents,
};
