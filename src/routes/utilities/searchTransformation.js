import handlebars from 'handlebars';
import { FormattedMessage } from 'react-intl';
import config from '../../../docs/gokb-search-v1.json';

export const searchParameterHandlers = {
  'Handlebars': (parameter, searchString) => {
    try {
      const template = handlebars.compile(parameter);
      return template({ string: searchString });
    } catch (error) {
      console.error('Error in Handlebars template compilation:', error);
      return '';
    }
  },

  'Static': (parameter) => parameter,
  'JSONPath': (parameter, searchString, context) => {
    return parameter;
  }
};

export const transformSearchParameter = (searchConfig, searchOption, searchString) => {
  if (!searchConfig?.options || !searchString) return '';

  const selectedOption = searchConfig.options.find(opt => opt.name === searchOption);
  if (!selectedOption || !selectedOption.type || !selectedOption.parameter) return '';

  const handler = searchParameterHandlers[selectedOption.type];
  if (!handler) {
    console.warn(`No handler found for search parameter type: ${selectedOption.type}`);
    return '';
  }

  return handler(selectedOption.parameter, searchString);
};

export const buildSearchOptions = (searchConfig) => {
  if (!searchConfig?.options) {
    return [];
  }

  return searchConfig.options.map(option => ({
    key: option.name,
    label: <FormattedMessage id={`ui-agreements.gokbSearch.searchIndex.${option.name}`} />,
    value: option.name,
  }));
};

export const generateGokbQuery = (params, query, searchConfig) => {
  const perPage = params?.perPage || 25;
  const offset = (params.page - 1) * perPage;
  const searchString = query?.query || '';
  const searchOption = query?.qindex || 'keyword';

  const queryParts = [];

  if (searchString) {
    const searchParameter = transformSearchParameter(searchConfig, searchOption, searchString);
    if (searchParameter) {
      queryParts.push(searchParameter);
    }
  }

  queryParts.push(`max=${perPage}`);
  queryParts.push(`offset=${offset}`);

  if (query?.sort) {
    queryParts.push(`sort=${query.sort}`);
  }
  if (query?.order) {
    queryParts.push(`order=${query.order}`);
  }

  return `?${queryParts.join('&')}`;
};

export const generateKiwtQueryParams = (searchConfig, SASQMapFilterEntry, params, query) => {
  if (!searchConfig || !searchConfig.type) {
    return generateGokbQuery(params, query, searchConfig);
  }

  switch (searchConfig.type) {
    case 'queryDropdown':
      return generateGokbQuery(params, query, searchConfig);

    case 'static': {
      const perPage = params?.perPage || 25;
      const offset = (params.page - 1) * perPage;
      return `?max=${perPage}&offset=${offset}`;
    }

    default:
      console.warn(`Unknown configuration type: ${searchConfig.type}`);
      return generateGokbQuery(params, query, searchConfig);
  }
};

export const getSearchableIndexes = () => {
  return buildSearchOptions(config.configuration.results.fetch.search);
};

export const searchableIndexes = getSearchableIndexes();



