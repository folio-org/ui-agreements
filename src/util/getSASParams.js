export default (options) => (queryParams, pathComponents, resources) => {
  const { searchKey = '' } = options;

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

      return `${term};${descending ? 'desc' : 'asc'}`;
    });
  }

  return params;
};
