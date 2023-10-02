import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import {
  generateKiwtQueryParams,
  useKiwtSASQuery
} from '@k-int/stripes-kint-components';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import {
  getRefdataValuesByDesc,
  usePrevNextPagination,
  useTags
} from '@folio/stripes-erm-components';

import View from '../../components/views/Packages';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import {
  PACKAGES_ENDPOINT,
  resourceClasses,
  resultCount
} from '../../constants';

import { useAgreementsRefdata } from '../../hooks';

const RESULT_COUNT_INCREMENT = resultCount.RESULT_COUNT_INCREMENT_MEDIUM;

const [
  AVAILABILITY_CONSTRAINT,
  CONTENT_TYPE,
  LIFECYCLE_STATUS,
  SCOPE,
] = [
  'AvailabilityConstraint.Body',
  'Pkg.ContentType',
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


  const { currentPage } = usePrevNextPagination();


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
        source: 'source',
        scope: 'availabilityScope.value',
        status: 'lifecycleStatus.value',
        tags: 'tags.value',
      },
      page: currentPage,
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [currentPage, query]);


  const {
    data: { results: packages = [], totalRecords: packagesCount = 0 } = {},
    error: eresourcesError,
    isLoading: areEresourcesLoading,
    isError: isEresourcesError
  } = useQuery(
    ['ERM', 'Packages', packagesQueryParams, PACKAGES_ENDPOINT],
    () => {
      const params = [...packagesQueryParams];
      return ky.get(`${PACKAGES_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: (!!query?.filters || !!query?.query) && !!currentPage,
    }
  );

  useEffect(() => {
    if (packagesCount === 1) {
      history.push(`${urls.packageView(packages[0].id)}${location.search}`);
    }
  }, [packages, packagesCount, history, location.search]);

  const dataSourcesPath = 'erm/packages/sources';
  const { data: dataSources = [] } = useQuery(
    ['ERM', 'DataSources', dataSourcesPath],
    () => ky.get(dataSourcesPath).json()
  );

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        availabilityValues: getRefdataValuesByDesc(refdata, AVAILABILITY_CONSTRAINT),
        contentTypeValues: getRefdataValuesByDesc(refdata, CONTENT_TYPE),
        packages,
        scopeValues: getRefdataValuesByDesc(refdata, SCOPE),
        sourceValues: dataSources,
        statusValues: getRefdataValuesByDesc(refdata, LIFECYCLE_STATUS),
        tagsValues: tags,
      }}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => packagesCount,
        loaded: () => !areEresourcesLoading,
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
