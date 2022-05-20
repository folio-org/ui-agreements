import { useCallback, useEffect, useState } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { chunk } from 'lodash';
import { useQueries } from 'react-query';

import { ORDER_LINES_ENDPOINT } from '../constants/endpoints';

const useChunkedOrderLines = (poLineIdsArray) => {
  const ky = useOkapiKy();

  const CONCURRENT_REQUESTS = 5; // Number of requests to make concurrently
  const STEP_SIZE = 60; // Number of ids to request for per concurrent request

  const chunkedItems = chunk(poLineIdsArray, STEP_SIZE);
  // chunkedItems will be an array of arrays of size CONCURRENT_REQUESTS * STEP_SIZE
  // We need to parallelise CONCURRENT_REQUESTS at a time,
  // and ensure we only fire the next lot once the previous lot are through

  const [isLoading, setIsLoading] = useState(poLineIdsArray?.length > 0);

  // Set up query array, and only enable the first CONCURRENT_REQUESTS requests
  const getQueryArray = useCallback(() => {
    const queryArray = [];
    chunkedItems.forEach((chunkedItem, chunkedItemIndex) => {
      const query = chunkedItem.map(item => `id==${item}`).join(' or ');
      queryArray.push({
        queryKey: [ORDER_LINES_ENDPOINT, chunkedItem],
        queryFn: () => ky.get(`${ORDER_LINES_ENDPOINT}?limit=1000&query=${query}`).json(),
        // Only enable once the previous slice has all been fetched
        enabled: chunkedItemIndex < CONCURRENT_REQUESTS
      });
    });

    return queryArray;
  }, [chunkedItems, ky]);

  const orderLineQueries = useQueries(getQueryArray());

  // Once chunk has finished fetching, fetch next chunk
  useEffect(() => {
    const chunkedOLQ = chunk(orderLineQueries, CONCURRENT_REQUESTS);
    chunkedOLQ.forEach((colq, i) => {
      // Check that all previous chunk are fetched,
      // and that all of our current chunk are not fetched and not loading
      if (
        i !== 0 &&
        chunkedOLQ[i - 1]?.every(pcolq => pcolq.isFetched === true) &&
        colq.every(req => req.isFetched === false) &&
        colq.every(req => req.isLoading === false)
      ) {
        // Trigger fetch for each request in the chunk
        colq.forEach(req => {
          req.refetch();
        });
      }
    });
  }, [orderLineQueries]);

  // Keep easy track of whether this hook is all loaded or not
  // (This slightly flattens the "isLoading/isFetched" distinction, but it's an ease of use prop)
  useEffect(() => {
    const newLoading = poLineIdsArray?.length > 0 && (!orderLineQueries?.length || orderLineQueries?.some(olq => !olq.isFetched));

    if (isLoading !== newLoading) {
      setIsLoading(newLoading);
    }
  }, [isLoading, orderLineQueries, poLineIdsArray?.length]);


  return {
    orderLineQueries,
    isLoading,
    // Offer all fetched orderLines in flattened array once ready
    orderLines: isLoading ? [] : orderLineQueries.reduce((acc, curr) => {
      return [...acc, ...(curr?.data?.poLines ?? [])];
    }, [])
  };
};

export default useChunkedOrderLines;
