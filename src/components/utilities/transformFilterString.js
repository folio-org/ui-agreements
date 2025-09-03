import { handlebarsCompile } from './handlebarsHelpers';

const transformFilterString = (queryFilterString, config) => {
  const filters = config.configuration.results.fetch?.filters || [];

  const filterGroups = {};
  const groupStrings = [];

  // Group filters by key

  queryFilterString?.split(',').forEach((filter) => {
    const [key, value] = filter.split('.');
    if (!filterGroups[key]) filterGroups[key] = [];
    filterGroups[key].push(value);
  });

  // Transform each group
  if (Object.keys(filterGroups).length > 0) {
    Object.entries(filterGroups).forEach(([key, values]) => {
      // find filter with name key from filters array
      const { filterString: { templateString, type: stringType } = {} } = filters.find(f => f.name === key) || {};
      if (stringType === 'Handlebars') {
        const template = handlebarsCompile(templateString);
        groupStrings.push(template({ valuesArray: values }));
      }
    });
  }

  return groupStrings.join('&');
};

export default transformFilterString;
