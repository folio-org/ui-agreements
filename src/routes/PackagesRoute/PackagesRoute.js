import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useQuery, useQueryClient, useMutation } from 'react-query';

import {
  generateKiwtQueryParams,
  useKiwtSASQuery
} from '@k-int/stripes-kint-components';

import { useOkapiKy, useStripes, useCallout } from '@folio/stripes/core';
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
  PACKAGES_SYNC_ENDPOINT,
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
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);

  const handleSelectPackageIds = (ids) => {
    setSelectedPackageIds(ids);
  };
  const queryClient = useQueryClient();
  const callout = useCallout();
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

  const packagesQueryParams = useMemo(() => generateKiwtQueryParams({
    searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
    // EXAMPLE -- when we wish to handle one case with special comparator,
    // we can add a special case for that value to filterConfig.
    // This does NOT neccesitate the filterKey inclusion here,
    // that is personal developer choice, it could just as easily be called
    // syncContentsFromSource in the url and not need the filterKey as well.
    filterConfig: [
      {
        name: 'synchronisationStatus',
        values: [
          { name: 'isNotSet', comparator: ' isNotSet', value: '' }
        ]
      }
    ],
    filterKeys: {
      availability: 'availabilityConstraints.body.value',
      contentType: 'contentTypes.contentType.value',
      remoteKb: 'remoteKb.id',
      source: 'source',
      scope: 'availabilityScope.value',
      status: 'lifecycleStatus.value',
      tags: 'tags.value',
      synchronisationStatus: 'syncContentsFromSource',
    },
    page: currentPage,
    perPage: RESULT_COUNT_INCREMENT
  }, query ?? {}), [currentPage, query]);

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
    if (packagesCount === 1 && packages.length > 0) {
      history.push(`${urls.packageView(packages[0].id)}${location.search}`);
    }
  }, [packages, packagesCount, history, location.search]);

  const dataSourcesPath = 'erm/packages/sources';
  const { data: dataSources = [] } = useQuery(
    ['ERM', 'DataSources', dataSourcesPath],
    () => ky.get(dataSourcesPath).json()
  );

  const { mutateAsync: synchronizePackages } = useMutation(
    [PACKAGES_SYNC_ENDPOINT, 'synchronize'],
    ({ packageIds, syncState }) => ky.post(PACKAGES_SYNC_ENDPOINT, {
      json: {
        packageIds,
        syncState
      }
    }).json()
      .then(() => {
        return queryClient.invalidateQueries(['ERM', 'Packages', packagesQueryParams, PACKAGES_ENDPOINT]);
      })
  );

  const handleSynchronize = (syncState) => {
    const packageIds = selectedPackageIds;
    synchronizePackages({ packageIds, syncState })
      .then(() => {
        const messageId = syncState === true
          ? 'ui-agreements.eresources.syncPackagesSuccess'
          : 'ui-agreements.eresources.pauseSyncPackagesSuccess';

        callout.sendCallout({
          message: (
            <FormattedMessage
              id={messageId}
              values={{ packageCount: packageIds.length }}
            />
          ),
        });
      })
      .catch(() => {
        callout.sendCallout({
          type: 'error',
          timeout: 0,
          message: (
            <FormattedMessage
              id="ui-agreements.eresources.syncPackagesError"
            />
          ),
        });
      });
  };

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
        synchronisationStatusValues: [
          { label: <FormattedMessage id="ui-agreements.eresources.syncStatus.true" />, value: 'true' },
          { label: <FormattedMessage id="ui-agreements.eresources.syncStatus.false" />, value: 'false' },
          { label: <FormattedMessage id="ui-agreements.eresources.syncStatus.notSet" />, value: 'isNotSet' }
        ]
      }}
      handleSyncPackages={handleSynchronize}
      onSelectPackageIds={handleSelectPackageIds}
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
      stripes={stripes}
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
