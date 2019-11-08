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

  afterCreate(agreement, server) {
    const { items = [] } = agreement;
    items.forEach(agreementLine => {
      server.create('agreement-line', {
        ...agreementLine,
        owner: {
          id: agreement.id,
        },
      });
    });
  }
});
