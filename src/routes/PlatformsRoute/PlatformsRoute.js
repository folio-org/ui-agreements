import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import {
  generateKiwtQueryParams,
  useKiwtSASQuery,
  usePrevNextPagination
} from '@k-int/stripes-kint-components';

import View from '../../components/views/Platforms';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import { PLATFORMS_ENDPOINT, resultCount } from '../../constants';

const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const PlatformsRoute = ({
  children,
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-agreements.platforms.view');
  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const { query, queryGetter, querySetter } = useKiwtSASQuery();
  const { currentPage } = usePrevNextPagination();

  const platformsQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name',
      page: currentPage,
      perPage: RESULT_COUNT_INCREMENT_MEDIUM
    }, (query ?? {}))
  ), [query, currentPage]);

  const {
    data: { results: platforms = [], totalRecords: platformsCount = 0 } = {},
    error: platformsError,
    isLoading: arePlatformsLoading,
    isError: isPlatformError
  } = useQuery(
    [PLATFORMS_ENDPOINT, platformsQueryParams, 'ui-agreements', 'PlatformsRoute', 'getPlatforms'],
    () => {
      const params = [...platformsQueryParams];
      return ky.get(`${PLATFORMS_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: !!query?.filters || !!query?.query
    }
  );

  useEffect(() => {
    if (platformsCount === 1) {
      history.push(`${urls.platformView(platforms[0].id)}${location.search}`);
    }
  }, [platforms, platformsCount, history, location.search]);

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        platforms,
      }}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => platformsCount,
        loaded: () => !arePlatformsLoading,
        pending: () => arePlatformsLoading,
        failure: () => isPlatformError,
        failureMessage: () => platformsError.message
      }}
    >
      {children}
    </View>
  );
};

PlatformsRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.object,
  }),
};

export default PlatformsRoute;
