import handlebars from 'handlebars';

/* Register handlebar helpers */

handlebars.registerHelper('replace', (text, search, replacement) => {
  if (typeof text !== 'string') return text;
  return text.replace(new RegExp(search, 'g'), replacement);
});

handlebars.registerHelper('startsWith', (text, char) => {
  return text?.startsWith(char);
});

/* Recursive formatter function */

const getSortFunction = (type, sortConfig) => {
  switch (type) {
    case 'Handlebars': {
      const template = handlebars.compile(sortConfig.templateString);
      return template;
    }
    default:
      return () => '';
  }
};

/* Main exported function */

const getSortConfig = ({ sortConfig }) => {
  const sortFunction = getSortFunction(sortConfig.type, sortConfig);

  return {
    sortQueryFunction: sortFunction,
  };
};

export default getSortConfig;
