import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'compose-function';

import { useQuery } from 'react-query';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import View from '../../components/views/EResource';
import { parseMclPageSize, urls, withSuppressFromDiscovery } from '../../components/utilities';
import { resultCount, resourceClasses } from '../../constants';

import { useAgreementsHelperApp, useInfiniteFetch } from '../../hooks';

const { RECORDS_PER_REQUEST_MEDIUM } = resultCount;

const EResourceViewRoute = ({
  handlers = [],
  history,
  location,
  isSuppressFromDiscoveryEnabled,
  match: { params: { id: eresourceId } },
  tagsEnabled,
}) => {
  const ky = useOkapiKy();
  const {
    handleToggleTags,
    HelperComponent,
    TagButton,
  } = useAgreementsHelperApp(tagsEnabled);

  const eresourcesPath = 'erm/resource';
  const eresourcePath = `${eresourcesPath}/${eresourceId}`;

  const { data: eresource = {}, isLoading: isEresourceLoading } = useQuery(
    [eresourcePath, 'ui-agreements', 'EresourceViewRoute', 'getEresource'],
    () => ky.get(eresourcePath).json()
  );

  const { data: { configs: settings } = {} } = useQuery(
    ['configurations/entries', 'query=(module=AGREEMENTS and configName=general)', 'ui-agreements', 'EresourceViewRoute', 'getSettings'],
    () => ky.get('configurations/entries?query=(module=AGREEMENTS and configName=general)').json()
  );

  const entitlementsPath = `${eresourcePath}/entitlements`;
  const relatedEntitlementsPath = `${entitlementsPath}/related`;
  const entitlementOptionsPath = `${eresourcePath}/entitlementOptions`;

  // AGREEMENTS FOR ERESOURCE INFINITE FETCH
  const eresourceAgreementParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        perPage: parseMclPageSize({ records: settings }, 'entitlements')
      },
      {}
    )
  ), [settings]);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextEntitlementsPage,
    },
    results: entitlements = [],
    total: entitlementsCount = 0
  } = useInfiniteFetch(
    [entitlementsPath, eresourceAgreementParams, 'ui-agreements', 'EresourceViewRoute', 'getEntitlements'],
    ({ pageParam = 0 }) => {
      const params = [...eresourceAgreementParams, `offset=${pageParam}`];
      return ky.get(`${entitlementsPath}?${params?.join('&')}`).json();
    }
  );

  // RELATED ENTITLEMENTS FOR ERESOURCE INFINITE FETCH
  // For this one we want to keep batch fetching until we have all of them or entitlementsCount, whichever comes first
  const eresourceRelatedEntitlementsParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        perPage: RECORDS_PER_REQUEST_MEDIUM
      },
      {}
    )
  ), []);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextRelatedEntitlementsPage,
      data: { pageParams: relatedEntitlementPageParams } = {}
    },
    results: relatedEntitlements = [],
    total: relatedEntitlementsCount = 0
  } = useInfiniteFetch(
    [relatedEntitlementsPath, eresourceRelatedEntitlementsParams, 'ui-agreements', 'EresourceViewRoute', 'getRelatedEntitlements'],
    ({ pageParam = 0 }) => {
      const params = [...eresourceRelatedEntitlementsParams, `offset=${pageParam}`];
      return ky.get(`${relatedEntitlementsPath}?${params?.join('&')}`).json();
    }
  );

  // Keep fetching them in chunks until we have all the values we require
  useEffect(() => {
    if (
      relatedEntitlements?.length !== relatedEntitlementsCount &&
      relatedEntitlements?.length < entitlementsCount
    ) {
      fetchNextRelatedEntitlementsPage({ pageParam: (relatedEntitlementPageParams[-1] ?? 0) + RECORDS_PER_REQUEST_MEDIUM })
    }
  });

  // ENTITLEMENT OPTIONS FOR ERESOURCE INFINITE FETCH
  const eresourceEntitlementOptionsParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        perPage: parseMclPageSize({ records: settings }, 'entitlementOptions')
      },
      {}
    )
  ), [settings]);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextEntitlementOptionsPage,
    },
    results: entitlementOptions = [],
    total: entitlementOptionsCount = 0
  } = useInfiniteFetch(
    [entitlementOptionsPath, eresourceEntitlementOptionsParams, 'ui-agreements', 'EresourceViewRoute', 'getEntitlementOptions'],
    ({ pageParam = 0 }) => {
      const params = [...eresourceEntitlementOptionsParams, `offset=${pageParam}`];
      return ky.get(`${entitlementOptionsPath}?${params?.join('&')}`).json();
    }
  );

  // PACKAGE CONTENTS FOR ERESOURCE
  const [contentFilter, setContentFilter] = useState('current');
  const packageContentPath = `erm/packages/${eresourceId}/content/${contentFilter}`

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
        perPage: parseMclPageSize({ records: settings }, 'packageContents')
      },
      {}
    )
  ), [eresourceId, settings]);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextContentsPage,
    },
    results: packageContents = [],
    total: packageContentsCount = 0
  } = useInfiniteFetch(
    [packageContentPath, packageContentsParams, 'ui-agreements', 'EresourceViewRoute', 'getPackageContents'],
    ({ pageParam = 0 }) => {
      const params = [...packageContentsParams, `offset=${pageParam}`];
      return ky.get(`${packageContentPath}?${params?.join('&')}`).json();
    }
  );

  const handleClose = () => {
    history.push(`${urls.eresources()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.eresourceEdit(eresourceId)}${location.search}`);
  };

  const handleEResourceClick = (id) => {
    history.push(`${urls.eresourceView(id)}${location.search}`);
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
        onNeedMoreEntitlements: (_askAmount, index) => fetchNextEntitlementsPage({ pageParam: index }),
        onNeedMoreEntitlementOptions: (_askAmount, index) => fetchNextEntitlementOptionsPage({ pageParam: index }),
        onNeedMorePackageContents: (_askAmount, index) => fetchNextContentsPage({ pageParam: index }),
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
  isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
  tagsEnabled: PropTypes.bool,
};


export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
  withTags,
)(EResourceViewRoute);
