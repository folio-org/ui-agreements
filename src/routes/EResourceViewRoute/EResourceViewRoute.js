import { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useCallout, useOkapiKy } from '@folio/stripes/core';

import { useParallelBatchFetch, useErmHelperApp } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, usePrevNextPagination } from '@k-int/stripes-kint-components';

import View from '../../components/views/EResource';
import { parseMclPageSize, urls } from '../../components/utilities';

import {
  ERESOURCE_ENDPOINT,
  ERESOURCE_ENTITLEMENTS_ENDPOINT,
  ERESOURCE_ENTITLEMENT_OPTIONS_ENDPOINT,
  ERESOURCE_RELATED_ENTITLEMENTS_ENDPOINT,
  ENTITLEMENT_AGREEMENTS_LIST_PAGINATION_ID,
  ENTITLEMENT_OPTIONS_PAGINATION_ID,
  PACKAGE_CONTENT_PAGINATION_ID,
  PACKAGES_SYNC_ENDPOINT,
  ERESOURCES_DRY_RUN_ENDPOINT,
  ERESOURCES_DELETE_ENDPOINT,
  resourceClasses,
} from '../../constants';
import { useAgreementsDisplaySettings, useSuppressFromDiscovery } from '../../hooks';

const EResourceViewRoute = ({
  handlers = [],
  history,
  location,
  match: { params: { id: eresourceId } },
}) => {
  const queryClient = useQueryClient();
  const ky = useOkapiKy();
  const callout = useCallout();

  const linkRef = useRef(null);

  const {
    handleToggleTags,
    HelperComponent,
    TagButton,
  } = useErmHelperApp();

  const settings = useAgreementsDisplaySettings();
  const entitlementAgreementsPageSize = parseMclPageSize(settings, 'entitlements');
  const entitlementOptionsPageSize = parseMclPageSize(settings, 'entitlementOptions');
  const packageContentsPageSize = parseMclPageSize(settings, 'packageContents');

  const { currentPage: entitlementAgreementsPage } = usePrevNextPagination({
    pageSize: entitlementAgreementsPageSize, // Only needed for reading back MCL props
    id: `${ENTITLEMENT_AGREEMENTS_LIST_PAGINATION_ID}-${eresourceId}`,
    syncToLocation: false
  });

  const { currentPage: entitlementOptionsPage } = usePrevNextPagination({
    pageSize: entitlementOptionsPageSize, // Only needed for reading back MCL props
    id: `${ENTITLEMENT_OPTIONS_PAGINATION_ID}-${eresourceId}`,
    syncToLocation: false
  });

  const { currentPage: packageContentsPage } = usePrevNextPagination({
    pageSize: packageContentsPageSize, // Only needed for reading back MCL props
    id: `${PACKAGE_CONTENT_PAGINATION_ID}-${eresourceId}`,
    syncToLocation: false
  });

  const isSuppressFromDiscoveryEnabled = useSuppressFromDiscovery();

  const eresourcePath = ERESOURCE_ENDPOINT(eresourceId);

  const { data: eresource = {}, isLoading: isEresourceLoading } = useQuery(
    // NOTE Used in invalidateLinks for tags below!
    [eresourcePath, 'getEresource'],
    () => ky.get(eresourcePath).json()
  );

  const { mutateAsync: synchronizePackage } = useMutation(
    [PACKAGES_SYNC_ENDPOINT, eresourceId, 'synchronize'],
    ({ syncState }) => ky.post(PACKAGES_SYNC_ENDPOINT, {
      json: {
        packageIds: [eresourceId],
        syncState
      }
    }).json()
      .then(() => queryClient.invalidateQueries([eresourcePath]))
      .then(() => queryClient.invalidateQueries(['ERM', 'Packages']))
  );

  const handleSynchronize = (syncState) => {
    synchronizePackage({ syncState })
      .then(() => {
        callout.sendCallout({
          message: (
            <FormattedMessage
              id={`ui-agreements.eresources.syncPackageSuccess.${syncState}`}
              values={{ packageName: eresource.name }}
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
              id="ui-agreements.eresources.syncPackageError"
            />
          ),
        });
      });
  };

  const { mutateAsync: handleDeleteDryRun } = useMutation(
    [ERESOURCES_DRY_RUN_ENDPOINT, eresourceId, 'deleteDryRun'],
    () => ky.post(ERESOURCES_DRY_RUN_ENDPOINT('pkg'), {
      json: {
        resources: [eresourceId]
      }
    }).json()
      .then(response => {
        const numberDeleted = response?.statistics?.pci ?? 0;
        return { numberDeleted };
      })
  );

  const { mutateAsync: handleDelete } = useMutation(
    [ERESOURCES_DELETE_ENDPOINT, eresourceId, 'delete'],
    () => ky.post(ERESOURCES_DELETE_ENDPOINT('pkg'), {
      json: {
        resources: [eresourceId]
      }
    }).json()
      .then(response => {
        const jobId = response?.id;
        const pkgName = eresource.name;

        callout.sendCallout({
          message: (
            <>
              <p>
                <FormattedMessage
                  id="ui-agreements.eresources.deleteJob.success"
                  values={{ pkgName }}
                />
              </p>
              <p>
                <Link ref={linkRef} to={`/local-kb-admin/${jobId}`}>
                  <FormattedMessage id="ui-agreements.eresources.viewJobLink" />
                </Link>
              </p>
            </>
          ),
          timeout: 10000
        });

        setTimeout(() => {
          linkRef.current?.focus();
        }, 50);
      })
  );

  const entitlementsPath = ERESOURCE_ENTITLEMENTS_ENDPOINT(eresourceId);
  const entitlementOptionsPath = ERESOURCE_ENTITLEMENT_OPTIONS_ENDPOINT(eresourceId);

  // AGREEMENTS FOR ERESOURCE INFINITE FETCH
  const eresourceAgreementParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        page: entitlementAgreementsPage,
        perPage: entitlementAgreementsPageSize
      },
      {}
    )
  ), [entitlementAgreementsPageSize, entitlementAgreementsPage]);

  const {
    data: { results: entitlements = [], totalRecords: entitlementsCount = 0 } = {},
    isLoading: areEntitlementsLoading
  } = useQuery(
    [entitlementsPath, eresourceAgreementParams, 'ui-agreements', 'EresourceViewRoute', 'getEntitlements'],
    () => {
      const params = [...eresourceAgreementParams];
      return ky.get(`${entitlementsPath}?${params?.join('&')}`).json();
    },
  );


  // RELATED ENTITLEMENTS FOR ERESOURCE BATCH FETCH
  const { items: relatedEntitlements, isLoading: areRelatedEntitlementsLoading } = useParallelBatchFetch({
    generateQueryKey: ({ offset }) => ['ERM', 'Entitlements', ERESOURCE_RELATED_ENTITLEMENTS_ENDPOINT(eresourceId), offset, 'EresourceViewRoute'],
    endpoint: ERESOURCE_RELATED_ENTITLEMENTS_ENDPOINT(eresourceId),
    queryParams: {
      enabled: (!!eresource?.id && eresource?.class !== resourceClasses?.PACKAGE)
    }
  });


  // ENTITLEMENT OPTIONS FOR ERESOURCE INFINITE FETCH
  const eresourceEntitlementOptionsParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        page: entitlementOptionsPage,
        perPage: entitlementOptionsPageSize
      },
      {}
    )
  ), [entitlementOptionsPageSize, entitlementOptionsPage]);

  const {
    data: { results: entitlementOptions = [], totalRecords: entitlementOptionsCount = 0 } = {},
    isLoading: areEntitlementOptionsLoading
  } = useQuery(
    [entitlementOptionsPath, eresourceEntitlementOptionsParams, 'ui-agreements', 'EresourceViewRoute', 'getEntitlementOptions'],
    () => {
      const params = [...eresourceEntitlementOptionsParams];
      return ky.get(`${entitlementOptionsPath}?${params?.join('&')}`).json();
    },
    {
      enabled: !!entitlementOptionsPage && !!entitlementOptionsPageSize
    }
  );

  // PACKAGE CONTENTS FOR ERESOURCE
  const [contentFilter, setContentFilter] = useState('current');
  const packageContentPath = `erm/packages/${eresourceId}/content/${contentFilter}`;

  const packageContentsParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        filters: [{
          path: 'pkg.id',
          value: eresourceId
        }],
        sort: [{
          path: 'pti.titleInstance.name'
        }],
        page: packageContentsPage,
        perPage: packageContentsPageSize
      },
      {}
    )
  ), [eresourceId, packageContentsPage, packageContentsPageSize]);


  const {
    data: { results: packageContents = [], totalRecords: packageContentsCount = 0 } = {},
    isLoading: areContentsLoading
  } = useQuery(
    [packageContentPath, packageContentsParams, 'ui-agreements', 'EresourceViewRoute', 'getPackageContents'],
    () => {
      const params = [...packageContentsParams];
      return ky.get(`${packageContentPath}?${params?.join('&')}`).json();
    }
  );

  const handleClose = () => {
    if (location.pathname?.startsWith('/erm/titles')) {
      history.push(`${urls.titles()}${location.search}`);
    } else {
      history.push(`${urls.packages()}${location.search}`);
    }
  };

  const handleEdit = () => {
    // We currently only have edit for non-package resources
    history.push(`${urls.titleEdit(eresourceId)}${location.search}`);
  };

  /*
  * This method is currently only used in "Options for acquiring e-resource",
  * which is found on a Title view. This link could need to redirect to either
  * the packages OR the titles route, depending on context.
  */
  const handleEResourceClick = (id, destination = 'TITLE') => {
    if (destination === 'TITLE') {
      history.push(`${urls.titleView(id)}${location.search}`);
    } else {
      history.push(`${urls.packageView(id)}${location.search}`);
    }
  };

  const isLoading = () => {
    return (
      eresourceId !== eresource?.id &&
      isEresourceLoading
    );
  };

  const getTagsLink = () => {
    let resourceString;
    if (eresource.class === resourceClasses.TITLEINSTANCE) {
      resourceString = 'titles';
    } else if (eresource.class === resourceClasses.PCI) {
      resourceString = 'pci';
    }

    return `erm/${resourceString}/${eresourceId}`;
  };

  return (
    <View
      key={`eresource-view-pane-${eresourceId}`}
      components={{
        HelperComponent,
        TagButton
      }}
      data={{
        areEntitlementOptionsLoading,
        areEntitlementsLoading,
        areContentsLoading,
        areRelatedEntitlementsLoading,
        eresource,
        entitlementOptions,
        entitlementOptionsCount,
        entitlements,
        entitlementsCount,
        packageContentsFilter: contentFilter,
        packageContents,
        packageContentsCount,
        relatedEntitlements,
        searchString: location.search,
        tagsInvalidateLinks: [eresourcePath],
        tagsLink: getTagsLink(),
      }}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onFilterPackageContents: (path) => setContentFilter(path),
        onClose: handleClose,
        onEdit: handleEdit,
        onEResourceClick: handleEResourceClick,
        onToggleTags: handleToggleTags,
        onSynchronize: handleSynchronize,
        onDeleteDryRun: handleDeleteDryRun,
        onDelete: handleDelete,
      }}
      isLoading={isLoading()}
    />
  );
};

EResourceViewRoute.propTypes = {
  handlers: PropTypes.shape({
    onFilterPackageContents: PropTypes.func,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onEResourceClick: PropTypes.func,
    onSynchronize: PropTypes.func,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};


export default EResourceViewRoute;
