import { FormattedMessage } from 'react-intl';
import { Select } from '@folio/stripes/components';
import handlebars from 'handlebars';

const handleBarsTransform = (searchConfig, queryString) => {
  const template = handlebars.compile(searchConfig.templateString);
  return template({ string: queryString });
};

// Since this is reusing handlebars logic, should 1000% be moved elsewhere
const searchConfigOptionsHandler = (type, searchConfig, queryString) => {
  switch (type) {
    case 'Handlebars':
      return handleBarsTransform(searchConfig, queryString);
    default:
      return null;
  }
};

const queryDropdownConstructor = ({ options, queryState, setQueryState }) => {
  const searchLookup = options.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]: { ...curr },
    }),
    {}
  );

  const searchOptions = options.map((option) => {
    return {
      label: (
        <FormattedMessage
          id={`ui-agreements.gokbSearch.searchIndex.${option.name}`}
        />
      ),
      value: option.name,
    };
  });

  const defaultValue = options.find((opt) => opt.default === true)?.name;

  return {
    searchParameterParse: (selectedOption = defaultValue, searchString) => {
      const searchQueryString = searchConfigOptionsHandler(
        searchLookup[selectedOption]?.type,
        searchLookup[selectedOption],
        searchString
      );
      return searchQueryString;
    },
    HeaderComponent: () => {
      return (
        <Select
          dataOptions={searchOptions}
          id="search-dropdown"
          onChange={(e) => setQueryState({
            ...queryState,
            searchKey: searchLookup[e.target.value]?.name,
          })
          }
          placeholder={
            <FormattedMessage id="ui-agreements.gokbSearch.searchBy" />
          }
          value={searchLookup[queryState?.searchKey]?.name || defaultValue}
        />
      );
    },
  };
};

export const searchConfigTypeHandler = ({
  type,
  searchConfig,
  queryState,
  setQueryState,
}) => {
  switch (type) {
    case 'queryDropdown':
      return queryDropdownConstructor({
        options: searchConfig.options,
        queryState,
        setQueryState,
      });
    default:
      return null;
  }
};
