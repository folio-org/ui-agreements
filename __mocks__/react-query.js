import { mockReactQuery } from '@folio/stripes-erm-testing/jest/mocks';

module.exports = {
  ...jest.requireActual('react-query'),
  ...mockReactQuery
};
