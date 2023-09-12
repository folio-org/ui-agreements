import { useChunkedCQLFetch } from '@folio/stripes/core';

import { ORDER_LINES_ENDPOINT } from '../constants';
// When fetching from a potentially large list of order lines,
// make sure to chunk the request to avoid hitting limits.
const useChunkedOrderLines = (poLineIdsArray, queryOptions = {}) => {
  const {
    itemQueries: orderLineQueries,
    isLoading,
    items: orderLines
  } = useChunkedCQLFetch({
    ids: poLineIdsArray,
    endpoint: ORDER_LINES_ENDPOINT,
    reduceFunction: (olq) => (
      olq.reduce((acc, curr) => {
        return [...acc, ...(curr?.data?.poLines ?? [])];
      }, [])
    ),
    queryOptions
  });

  return {
    orderLineQueries,
    isLoading,
    orderLines
  };
};

export default useChunkedOrderLines;
