import { FormattedMessage } from 'react-intl';
import { Select } from '@folio/stripes/components';
import handlebars from 'handlebars';
import { useState } from 'react';

const handleBarsTransform = (searchConfig, query) => {
  const template = handlebars.compile(searchConfig.templateString);
  return template({ query });
};

// Since this is reusing handlebars logic, should 1000% be moved elsewhere
const searchConfigOptionsHandler = (type, searchConfig, query) => {
  switch (type) {
    case 'Handlebars':
      return handleBarsTransform(searchConfig, query);
    default:
      return null;
  }
};

const QueryDropdown = ({ options }) => {
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
  const [searchKey, setSearchKey] = useState(defaultValue);

  // This should also potentially be returning an sasqRenderProps object
  return {
    searchQueryFunction: (query) => {
      const searchQueryString = searchConfigOptionsHandler(
        searchLookup[searchKey]?.type,
        searchLookup[searchKey],
        query
      );

      return { key: searchKey, string: searchQueryString };
    },
    HeaderComponent: () => (
      <Select
        dataOptions={searchOptions}
        id="search-dropdown"
        onChange={(e) => {
          setSearchKey(searchLookup[e.target.value]?.name);
        }}
        value={searchKey || defaultValue}
      />
    ),
  };
};

export const getSearchConfig = ({ searchConfig }) => {
  const { type } = searchConfig;
  switch (type) {
    case 'queryDropdown':
      return QueryDropdown({
        options: searchConfig.options,
      });
    default:
      return null;
  }
};
