import { Factory } from '@bigtest/mirage';

export default Factory.extend({
  contacts: () => [],
  orgs: () => [],
  historyLines: () => [],
  externalLicenseDocs: () => [],
  docs: () => [],
  usageDataProviders: () => [],
  tags: () => [],
  supplementaryDocs: () => [],
});
