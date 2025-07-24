import gokbConfig from '../../../docs/gokb-search-v1';

const getFilters = () => {
  const filters = gokbConfig.configuration.results.fetch?.filters || [];

  const filterMap = {};
  const filterNames = [];
  const filterOptions = {};
  const initialFilterState = {};

  filters.forEach((filter) => {
    if (filter.name && filter.filterPath) {
      filterMap[filter.name] = filter.filterPath;
      filterNames.push(filter.name);

      if (Array.isArray(filter.enumValues)) {
        filterOptions[filter.name] = filter.enumValues.map(({ name, value }) => ({
          label: name,
          value,
        }));

        const defaultOption = filter.enumValues.find(opt => opt.default);
        if (defaultOption) {
          initialFilterState[filter.name] = [defaultOption.value];
        }
      }
    }
  });

  return {
    filterMap,
    filterNames,
    filterOptions,
    initialFilterState
  };
};

export default getFilters;
