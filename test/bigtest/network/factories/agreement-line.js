import { Factory } from '@bigtest/mirage';

export default Factory.extend({
  activeFrom: null,
  activeTo: null,
  contentUpdated: null,
  coverage: [],
  customCoverage: false,
  endDate: null,
  explanation: '',
  haveAccess: true,
  startDate: null,
});
