import { FormattedMessage } from 'react-intl';
import gokbConfig from '../../../docs/gokb-search-v1';

const getFilterConfig = () => {
  const filters = gokbConfig.configuration.results.fetch?.filters?.options || [];

  const filterMap = {};
  const filterNames = [];
  const filterOptions = {};
  const initialFilterState = {};
  const filterTypes = {};

  filters.forEach((filter) => {
    filterMap[filter.name] = filter.filterPath;
    filterTypes[filter.name] = filter.type;
    filterNames.push(filter.name);

    if (Array.isArray(filter.values)) {
      filterOptions[filter.name] = filter.values.map(({ name, value }) => ({
        label: <FormattedMessage id={`ui-agreements.gokb.filters.${filter.name}.${name}`} />,
        value,
      }));

      const defaultOptions = filter.values.filter(opt => opt.default);
      if (defaultOptions.length > 0) {
        initialFilterState[filter.name] = defaultOptions.map(opt => opt.value);
      }
    }
  });

  return {
    filterMap,
    filterNames,
    filterOptions,
    initialFilterState,
    filterTypes
  };
};

export default getFilterConfig;
