import handlebars from 'handlebars';

export const config = {
  name: 'GOKb Search',
  version: '1.0',
  type: {
    name: 'SASQRouteConfig',
    version: '1.0'
  },
  configuration: {
    results: {
      fetch: {
        search: {
          type: 'queryDropdown',
          options: [
            { name: 'keyword', type: 'Handlebars', parameter: 'q=$string' },
            { name: 'nameAndAltNames', type: 'Handlebars', parameter: 'label=$string' },
            { name: 'nameOnly', type: 'Handlebars', parameter: 'name=$string' },
            { name: 'altNamesOnly', type: 'Handlebars', parameter: 'altname=$string' },
            { name: 'identifiers', type: 'Handlebars', parameter: 'identifier=$string' },
            { name: 'eisbn', type: 'Handlebars', parameter: 'identifier=eisbn,$string' },
            { name: 'pisbn', type: 'Handlebars', parameter: 'identifier=isbn,$string' },
            { name: 'eissn', type: 'Handlebars', parameter: 'identifier=eissn,$string' },
            { name: 'pissn', type: 'Handlebars', parameter: 'identifier=issn,$string' },
            { name: 'ezbId', type: 'Handlebars', parameter: 'identifier=ezb,$string' },
            { name: 'zdbId', type: 'Handlebars', parameter: 'identifier=zdb,$string' },
            { name: 'gokbUuid', type: 'Handlebars', parameter: 'uuid=$string' },
            { name: 'gokbId', type: 'Handlebars', parameter: 'id=$string' },
            { name: 'authorEditor', type: 'Special', parameter: 'q=$string&qfields=firstAuthor&qfields=firstEditor' }
          ]
        }
      }
    }
  }
};

export const transformSearchParameter = (searchConfig, searchOption, searchString) => {
  if (!searchConfig?.options || !searchString) {
    return '';
  }

  const selectedOption = searchConfig.options.find(option => option.name === searchOption);
  if (!selectedOption || (selectedOption.type !== 'Handlebars' && selectedOption.type !== 'Special')) {
    return '';
  }

  try {
    if (selectedOption.type === 'Special' && selectedOption.name === 'authorEditor') {
      return selectedOption.parameter.replace('$string', searchString);
    }

    if (selectedOption.parameter.includes('$string')) {
      return selectedOption.parameter.replace('$string', searchString);
    }

    const template = handlebars.compile(selectedOption.parameter);
    return template({ string: searchString });
  } catch (error) {
    console.error('Error transforming search parameter:', error);
    return '';
  }
};

export const buildSearchOptions = (searchConfig, formatMessage) => {
  if (!searchConfig?.options) {
    return [];
  }

  return searchConfig.options.map(option => ({
    key: option.name,
    label: formatMessage({
      id: `ui-agreements.gokbSearch.searchIndex.${option.name}`,
      defaultMessage: option.name,
    }),
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


export const getSearchableIndexes = (formatMessage) => {
  return buildSearchOptions(config.configuration.results.fetch.search, formatMessage);
};


