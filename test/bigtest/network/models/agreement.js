import { Model, hasMany } from '@bigtest/mirage';

export default Model.extend({
  contacts: hasMany('contact')
});
