import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  user: () => faker.random.uuid(),
  personal: () => {
    return {
      firstName: faker.random.words(),
      middleName: faker.random.words(),
      lastName: faker.random.words(),
    };
  },
  role: () => {
    return {
      label: 'Agreement owner',
      value: 'agreement_owner'
    };
  },
});
