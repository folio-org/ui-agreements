import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useTags, useInfiniteFetch } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import View from '../../components/views/Packages';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resourceClasses, resultCount } from '../../constants';

import { PACKAGES_ENDPOINT } from '../../constants/endpoints';
import { useAgreementsRefdata } from '../../hooks';

const RESULT_COUNT_INCREMENT = resultCount.RESULT_COUNT_INCREMENT;

const [
  AVAILABILITY_CONSTRAINT,
  CONTENT_TYPE,
  LIFECYCLE_STATUS,
  SCOPE,
] = [
  'AvailabilityConstraint.Body',
  'ContentType.ContentType',
  'Pkg.LifecycleStatus',
  'Pkg.AvailabilityScope',
];

const PackagesRoute = ({
  children,
  history,
  location,
  match,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const hasPerms = stripes.hasPerm('ui-agreements.agreements.view');
  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const refdata = useAgreementsRefdata({
    desc: [
      AVAILABILITY_CONSTRAINT,
      CONTENT_TYPE,
      LIFECYCLE_STATUS,
      SCOPE,
    ]
  });

  const { data: { tags = [] } = {} } = useTags();
  const { query, querySetter, queryGetter } = useKiwtSASQuery();

  const packagesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
      filterConfig: [{
        name: 'class',
        values: [
          { name: 'package', value: resourceClasses?.PACKAGE },
        ]
      }],
      filterKeys: {
        availability: 'availabilityConstraints.body.value',
        contentType: 'contentTypes.contentType.value',
        remoteKb: 'remoteKb.id',
        scope: 'availabilityScope.value',
        status: 'lifecycleStatus.value',
        tags: 'tags.value',
      },
      filters: [
        {
          value: 'electronic'
        }
      ],
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [query]);


  const {
    infiniteQueryObject: {
      error: eresourcesError,
      fetchNextPage: fetchNextPackagesPage,
      isLoading: areEresourcesLoading,
      isIdle: isPackagesIdle,
      isError: isEresourcesError
    },
    results: packages = [],
    total: packagesCount = 0
  } = useInfiniteFetch(
    ['ERM', 'Packages', packagesQueryParams, PACKAGES_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...packagesQueryParams, `offset=${pageParam}`];
      return ky.get(`${PACKAGES_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: !!query?.filters || !!query?.query
    }
  );

  useEffect(() => {
    if (packagesCount === 1) {
      history.push(`${urls.packageView(packages[0].id)}${location.search}`);
    }
  }, [packages, packagesCount, history, location.search]);

  const kbsPath = 'erm/kbs';
  const { data: kbs = [] } = useQuery(
    ['ERM', 'KnowledgeBases', kbsPath],
    () => ky.get(kbsPath).json()
  );

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        availabilityValues: getRefdataValuesByDesc(refdata, AVAILABILITY_CONSTRAINT),
        contentTypeValues: getRefdataValuesByDesc(refdata, CONTENT_TYPE),
        packages,
        scopeValues: getRefdataValuesByDesc(refdata, SCOPE),
        sourceValues: kbs,
        statusValues: getRefdataValuesByDesc(refdata, LIFECYCLE_STATUS),
        tagsValues: tags,
      }}
      onNeedMoreData={(_askAmount, index) => fetchNextPackagesPage({ pageParam: index })}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => packagesCount,
        loaded: () => !isPackagesIdle,
        pending: () => areEresourcesLoading,
        failure: () => isEresourcesError,
        failureMessage: () => eresourcesError.message
      }}
    >
      {children}
    </View>
  );
};

PackagesRoute.propTypes = {
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
};

export default PackagesRoute;
