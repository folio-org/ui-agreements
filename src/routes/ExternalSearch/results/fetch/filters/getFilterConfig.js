import { FormattedMessage } from 'react-intl';

import GokbFilters from './GokbFilters';
import transformFilterString from './transformFilterString';

const getFilterConfig = (filterConfig = [], kbKey) => {
  const filterMap = {};
  const filterNames = [];
  const filterOptions = {};
  const initialFilterState = {};
  const filterTypes = {};

  filterConfig.forEach((filter) => {
    filterMap[filter.name] = filter.filterPath;
    filterTypes[filter.name] = filter.type;
    filterNames.push(filter.name);

    if (Array.isArray(filter.values)) {
      filterOptions[filter.name] = filter.values.map(({ name, value }) => ({
        label: (
          <FormattedMessage
            id={`ui-agreements.${kbKey}.filters.${filter.name}.${name}`}
          />
        ),
        value,
      }));

      const defaultOptions = filter.values.filter((opt) => opt.default);
      if (defaultOptions.length > 0) {
        initialFilterState[filter.name] = defaultOptions.map(
          (opt) => opt.value
        );
      }
    }
  });

  const filterComponent = (props) => (
    <GokbFilters
      {...props}
      filterConfig={{
        filterMap,
        filterNames,
        filterOptions,
        initialFilterState,
        filterTypes,
      }}
      kbKey={kbKey}
    />
  );

  const filterQueryFunction = transformFilterString;

  return {
    filterMap,
    initialFilterState,
    filterQueryFunction,
    FilterComponent: filterComponent,
  };
};

export default getFilterConfig;
