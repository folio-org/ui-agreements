import handlebars from 'handlebars';

import config from '../../../docs/gokb-search-v1';

const transformFilterString = (filterString) => {
  const filterConfig = config.configuration.results.fetch?.filters || [];
  let transformedFilterString = '';

  filterString?.split(',').forEach((filter) => {
    const [key, value] = filter.split('.');
    const filterDef = filterConfig.find(f => f.name === key);

    if (filterDef?.filterString && filterDef.filterString.type === 'Handlebars') {
      const { templateString, separator } = filterDef.filterString;
      const template = handlebars.compile(templateString);
      const transformedValue = template({ filter: filterDef.filterPath, value });
      // either attach transformedValue to transformedFilterString with separator or declare
      // transformedFilterString as the transformedValue if it's the first one
      transformedFilterString += transformedFilterString ? `${separator}${transformedValue}` : transformedValue;
    }
  });
  return transformedFilterString;
};

export default transformFilterString;
