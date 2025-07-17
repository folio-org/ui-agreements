import gokbConfig from '../../../docs/gokb-search-v1';

const getFilters = () => {
  const filters = gokbConfig.configuration.results.fetch?.filters || [];

  const filterMap = {};
  const filterNames = [];
  const filterOptions = {};

  filters.forEach((filter) => {
    if (filter.name && filter.filterPath) {
      filterMap[filter.name] = filter.filterPath;
      filterNames.push(filter.name);

      if (Array.isArray(filter.enumValues)) {
        filterOptions[filter.name] = filter.enumValues.map(({ name, value }) => ({
          label: name,
          value,
        }));
      }
    }
  });

  return {
    filterMap,      // e.g., { type: 'componentType', dummy: 'dummyPath' }
    filterNames,    // e.g., ['type', 'dummy']
    filterOptions,  // e.g., { type: [{label: 'all', value: 'Title'}, ...], dummy: [...] }
  };
};

export default getFilters;
