import handlebars from 'handlebars';

/* register handlebars helpers */

handlebars.registerHelper('replace', (text, search, replacement) => {
  if (typeof text !== 'string') return text;
  return text.replace(new RegExp(search, 'g'), replacement);
});

export const handlebarsCompile = (templateString) => {
  if (typeof templateString !== 'string') {
    throw new Error('Template string must be a valid string');
  }
  return handlebars.compile(templateString);
};

