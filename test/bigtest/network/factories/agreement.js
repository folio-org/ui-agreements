import { Factory, trait } from '@bigtest/mirage';

export default Factory.extend({
  contacts: () => [],
  orgs: () => [],
  historyLines: () => [],
  externalLicenseDocs: () => [],
  docs: () => [],
  usageDataProviders: () => [],
  tags: () => [],
  supplementaryDocs: () => [],

  withContacts: trait({
    afterCreate(agreement, server) {
      const contact = server.create('contact', agreement.internalContactData);
      agreement.update({
        contacts: [contact]
      });
      agreement.save();
    }
  }),
  
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
