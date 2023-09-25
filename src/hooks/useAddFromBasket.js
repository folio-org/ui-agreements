import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useHistory } from 'react-router-dom';

import isEqual from 'lodash/isEqual';
import queryString from 'query-string';

import { useOkapiKy } from '@folio/stripes/core';
import { AGREEMENT_LINES_EXTERNAL_ENDPOINT } from '../constants';

const useAddFromBasket = (basket) => {
  const location = useLocation();
  const history = useHistory();
  const ky = useOkapiKy();

  const { authority, referenceId } = queryString.parse(location?.search);
  const [query, setQuery] = useState(queryString.parse(location?.search));

  const getExternalEntitlementQuery = useCallback(() => {
    const queryArray = [];

    if (authority) {
      queryArray.push(`authority=${authority}`);
    }

    if (referenceId) {
      queryArray.push(`reference=${referenceId}`);
    }


    if (queryArray.length) {
      return `?${queryArray.join('&')}`;
    }
    return '';
  }, [authority, referenceId]);

  const { data: externalEntitlement, isLoading: isExternalEntitlementLoading } = useQuery(
    [AGREEMENT_LINES_EXTERNAL_ENDPOINT, authority, referenceId, 'getExternalEntitlements'],
    () => ky.get(`${AGREEMENT_LINES_EXTERNAL_ENDPOINT}${getExternalEntitlementQuery()}`).json(),
    {
      enabled: (!!referenceId || !!authority)
    }
  );

  useEffect(() => {
    const newQuery = queryString.parse(location.search);
    if (!isEqual(newQuery, query)
    ) {
      setQuery(newQuery);
    }
  }, [location.search, query]);

  const handleBasketLinesAdded = () => {
    // This is a replacement of the old "query" management we had previously.
    history.push({
      pathname: location.pathname,
      search: ''
    });
  };

  const getAgreementLinesToAdd = () => {
    const linesToAdd = [];

    let basketLines = [];
    if (query.addFromBasket) {
      basketLines = query.addFromBasket
        .split(',')
        .map(index => ({ resource: basket[parseInt(index, 10)] }))
        .filter(line => line.resource); // check that there _was_ a basket item at that index
    }

    if (externalEntitlement) {
      linesToAdd.push(externalEntitlement);
    }

    linesToAdd.push(...basketLines);

    return linesToAdd;
  };

  return {
    authority,
    isExternalEntitlementLoading,
    query,
    referenceId,
    handleBasketLinesAdded,
    getAgreementLinesToAdd
  };
};

export default useAddFromBasket;
