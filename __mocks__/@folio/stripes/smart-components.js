import { mockStripesSmartComponents } from '@folio/stripes-erm-testing/jest/mocks';

module.exports = {
  ...jest.requireActual('@folio/stripes/smart-components'),
  ...mockStripesSmartComponents
};
