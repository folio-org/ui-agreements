import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: () => faker.random.words(),
  customCoverage: () => false,

  afterCreate(eresource, server) {
    const {
      pcis = [],
    } = eresource;

    pcis.forEach(pci => {
      server.create('pci', {
        'class': 'org.olf.kb.PackageContentItem',
        'pti': pci.pti,
        'pkg': { id: eresource.id },
        'accessStart': pci.accessStart,
        'accessEnd': pci.accessEnd
      });
    });
  }
});
