import { mockErmComponents } from '@folio/stripes-erm-testing/jest/mocks';

module.exports = {
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents
};
