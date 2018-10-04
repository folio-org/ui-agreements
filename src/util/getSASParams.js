export default (options) => (queryParams, pathComponents, resources) => {
  const {
    searchKey = '',
    columnMap = {},
  } = options;

  const params = {
    stats: 'true',
  };

  const { query: { query, filters, sort } } = resources;

  if (query) {
    params.match = searchKey;
    params.term = query;
  }

  if (sort) {
    params.sort = sort.split(',').map(sortKey => {
      const descending = sortKey.startsWith('-');
      const term = sortKey.replace('-', '');
      const key = columnMap[term] || term;

      return `${key};${descending ? 'desc' : 'asc'}`;
    });
  }

  return params;
};
