import handlebars from 'handlebars';

import config from '../../../docs/gokb-search-v1';

const transformFilterString = (queryFilterString) => {
  const { group, prefix, filterString, renderStrategy, options } = config.configuration.results.fetch?.filters || [];
  const { type: stringType, templateString } = filterString || {};
  const { type: renderType, separator } = renderStrategy || {};

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
    if (stringType === 'Handlebars') {
      const template = handlebars.compile(templateString);

      Object.entries(filterGroups).forEach(([key, values]) => {
        const filterDef = options?.find(f => f.name === key);
        if (!filterDef) return;

        if (renderType === 'joinString') {
          const transformedValues = values.map(value => template({ filter: filterDef.filterPath, value }));

          const joinedGroup = transformedValues.join(separator);

          if (group && prefix) {
            // Group mode with prefix, eg: filters=...&filters=...
            groupStrings.push(`${prefix}=${joinedGroup}`);
          } else {
            // Flat mode (single prefix added later if needed)
            groupStrings.push(joinedGroup);
          }
        }
        // Other renderStrategy types than joinString can be added here
      });
    }
    // other filterString types than Handlebars can be added here
  }

  if (prefix && !group) {
    return `${prefix}=${groupStrings.join(separator)}`;
  }

  if (!prefix && !group) {
    return groupStrings.join(separator);
  }

  return groupStrings.join('&');
};

export default transformFilterString;
