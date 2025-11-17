import { FormattedMessage } from 'react-intl';
import { Select } from '@folio/stripes/components';
import handlebars from 'handlebars';
import { useSASQQIndex } from '@folio/stripes-erm-components';

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
  const { searchKey: qindex, setQIndex } = useSASQQIndex(defaultValue ? { defaultQIndex: defaultValue } : {});

  // This should also potentially be returning an sasqRenderProps object
  return {
    searchParameterParse: (query) => {
      const searchQueryString = searchConfigOptionsHandler(
        searchLookup[qindex]?.type,
        searchLookup[qindex],
        query
      );

      return { key: qindex || defaultValue, string: searchQueryString };
    },
    HeaderComponent: () => (
      <Select
        dataOptions={searchOptions}
        id="search-dropdown"
        onChange={(e) => {
          setQIndex(searchLookup[e.target.value]?.name);
        }}
        value={qindex || defaultValue}
      />
    ),
  };
};

export const searchConfigTypeHandler = ({ type, searchConfig }) => {
  switch (type) {
    case 'queryDropdown':
      return QueryDropdown({
        options: searchConfig.options,
      });
    default:
      return null;
  }
};
