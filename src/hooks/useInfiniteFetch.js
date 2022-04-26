import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

const useInfiniteFetch = (namespaceArray, fetchResources, queryParams) => {
  const infiniteQueryObject = useInfiniteQuery(
    namespaceArray,
    fetchResources,
    queryParams
  );

  const { results = [], total = 0 } = useMemo(() => (infiniteQueryObject?.data?.pages?.reduce(
    (acc, curr) => {
      const newAcc = { ...acc };
      if (!curr) {
        return newAcc;
      }

      for (const [key, value] of Object.entries(curr)) {
        if (
          key !== 'page' &&
          key !== 'result' &&
          acc[key] !== value
        ) {
          newAcc[key] = value;
        }
      }

      const newResults = [...(acc.results ?? [])];
      newResults.push(...(curr.results ?? []));
      newAcc.results = newResults;

      return newAcc;
    },
    {}
  ) ?? {}), [infiniteQueryObject?.data]);

  return {
    infiniteQueryObject,
    results,
    total
  };
};

export default useInfiniteFetch;
