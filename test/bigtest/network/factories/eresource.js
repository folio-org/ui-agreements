import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  class: () => faker.random.arrayElement(['org.olf.kb.Pkg']),
  name: () => faker.random.words(),
  customCoverage: () => false,


  afterCreate(eresource, server) {
    eresource.testData.forEach(item => {
      server.create('pci', {
        'class': 'org.olf.kb.PackageContentItem',
        'pti': item.pti,
        'pkg': { id: eresource.id },
        'accessStart': item.accessStart,
        'accessEnd': item.accessEnd
      });
    });
  }
});
