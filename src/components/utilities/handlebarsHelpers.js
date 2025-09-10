import handlebars from 'handlebars';

/* register handlebars helpers */

handlebars.registerHelper('replace', (text, search, replacement) => {
  if (typeof text !== 'string') return text;
  return text.replace(new RegExp(search, 'g'), replacement);
});

handlebars.registerHelper('buildFilterString', (valuesArray, fieldName, comparator, joiner) => {
  return valuesArray.map(v => `${fieldName}${comparator}${v}`).join(joiner);
});

handlebars.registerHelper('startsWith', (text, char) => {
  return text?.startsWith(char);
});

export const handlebarsCompile = (templateString) => {
  if (typeof templateString !== 'string') {
    throw new Error('Template string must be a valid string');
  }
  return handlebars.compile(templateString);
};

