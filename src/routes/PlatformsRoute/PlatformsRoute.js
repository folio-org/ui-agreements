import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { useInfiniteFetch } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import View from '../../components/views/Platforms';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { PLATFORMS_ENDPOINT } from '../../constants/endpoints';

const INITIAL_RESULT_COUNT = 50;

const PlatformsRoute = ({
  children,
  history,
  location,
  match,
  mutator,
  resources,
  stripes
}) => {
  const ky = useOkapiKy();
  const hasPerms = stripes.hasPerm('ui-agreements.platforms.view');
  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const platformsQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name',
      perPage: INITIAL_RESULT_COUNT
    }, (resources?.query ?? {}))
  ), [resources?.query]);

  const {
    infiniteQueryObject: {
      error: platformsError,
      fetchNextPage: fetchNextPlatformPage,
      isLoading: arePlatformsLoading,
      isError: isPlatformError
    },
    results: platforms = [],
    total: platformsCount = 0
  } = useInfiniteFetch(
    [PLATFORMS_ENDPOINT, platformsQueryParams, 'ui-agreements', 'PlatformsRoute', 'getPlatforms'],
    ({ pageParam = 0 }) => {
      const params = [...platformsQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${PLATFORMS_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  useEffect(() => {
    if (platformsCount === 1) {
      history.push(`${urls.platformView(platforms[0].id)}${location.search}`);
    }
  }, [platforms, platformsCount, history, location.search]);

  const querySetter = ({ nsValues }) => {
    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return resources?.query ?? {};
  };

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        platforms,
      }}
      onNeedMoreData={(_askAmount, index) => fetchNextPlatformPage({ pageParam: index })}
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

PlatformsRoute.manifest = Object.freeze({
  query: { initialValue: {} },
});

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
  mutator: PropTypes.object,
  resources: PropTypes.object,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.object,
  }),
};

export default stripesConnect(PlatformsRoute);
