import { handlebarsCompile } from '../../components/utilities';

/* Recursive formatter function */

const getSortFunction = (type, sortConfig) => {
  switch (type) {
    case 'Handlebars': {
      const template = handlebarsCompile(sortConfig.templateString);
      return template;
    }
    default:
      return () => '';
  }
};

/* Main exported function */

const getSortConfig = (sortConfig) => {
  const sortFunction = getSortFunction(sortConfig.type, sortConfig);

  return {
    sortQueryFunction: sortFunction,
  };
};

export default getSortConfig;
