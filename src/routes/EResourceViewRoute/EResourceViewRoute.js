import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useParallelBatchFetch, usePrevNextPagination } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

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
  resourceClasses
} from '../../constants';
import { useAgreementsHelperApp, useAgreementsSettings, useSuppressFromDiscovery } from '../../hooks';

const EResourceViewRoute = ({
  handlers = [],
  history,
  location,
  match: { params: { id: eresourceId } },
}) => {
  const ky = useOkapiKy();
  const {
    handleToggleTags,
    HelperComponent,
    TagButton,
  } = useAgreementsHelperApp();

  const settings = useAgreementsSettings();
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
      }}
      isLoading={isLoading()}
    />
  );
};

EResourceViewRoute.propTypes = {
  handlers: PropTypes.object,
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
