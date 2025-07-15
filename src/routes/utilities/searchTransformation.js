import handlebars from 'handlebars';
import { FormattedMessage } from 'react-intl';
import config from '../../../docs/gokb-search-v1.json';

export const transformSearchParameter = (searchConfig, searchOption, searchString) => {
  if (!searchConfig?.options || !searchString) return '';

  const selectedOption = searchConfig.options.find(opt => opt.name === searchOption);
  if (!selectedOption || selectedOption.type !== 'Handlebars') return '';

  try {
    const template = handlebars.compile(selectedOption.parameter);
    const result = template({ string: searchString });
    return result;
  } catch (error) {
    console.error('Error in template compilation:', error);
    return '';
  }
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
  const offset = (params.page - 1) * params.perPage;
  const searchString = query?.query || '';
  const searchOption = query?.qindex || 'keyword';

  const searchParameter = transformSearchParameter(searchConfig, searchOption, searchString);

  const queryParts = [];
  if (searchParameter) {
    queryParts.push(searchParameter);
  }

  const componentType = query?.componentType || 'Title';
  queryParts.push(`componentType=${componentType}`);

  queryParts.push(`max=${params?.perPage || 25}`);
  queryParts.push(`offset=${offset}`);

  if (query?.sort) {
    queryParts.push(`sort=${query.sort}`);
  }
  if (query?.order) {
    queryParts.push(`order=${query.order}`);
  }

  queryParts.push('status=Current');

  queryParts.push('es=true');

  return `?${queryParts.join('&')}`;
};

export const getSearchableIndexes = () => {
  return buildSearchOptions(config.configuration.results.fetch.search);
};

export const searchableIndexes = getSearchableIndexes(config.configuration.results.fetch, FormattedMessage);



