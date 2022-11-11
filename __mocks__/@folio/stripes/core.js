import { mockStripesCore, mockStripesIcon } from '@folio/stripes-erm-testing/jest/mocks';

jest.mock('@folio/stripes-components/lib/Icon', () => mockStripesIcon);

module.exports = {
  ...jest.requireActual('@folio/stripes-core'),
  ...mockStripesCore
};
