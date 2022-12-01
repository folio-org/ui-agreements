import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useTags, useInfiniteFetch } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import View from '../../components/views/EResources';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resultCount } from '../../constants';

import { ERESOURCES_ELECTRONIC_ENDPOINT } from '../../constants/endpoints';
import { useAgreementsRefdata } from '../../hooks';

const RESULT_COUNT_INCREMENT = resultCount.RESULT_COUNT_INCREMENT_MEDIUM;

const [
  AVAILABILITY_CONSTRAINT,
  CONTENT_TYPE,
  LIFECYCLE_STATUS,
  PUB_TYPE,
  SCOPE,
  TYPE
] = [
  'AvailabilityConstraint.Body',
  'ContentType.ContentType',
  'Pkg.LifecycleStatus',
  'TitleInstance.PublicationType',
  'Pkg.AvailabilityScope',
  'TitleInstance.Type',
];

const EResourcesRoute = ({
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
      PUB_TYPE,
      SCOPE,
      TYPE
    ]
  });

  const { data: { tags = [] } = {} } = useTags();
  const { query, querySetter, queryGetter } = useKiwtSASQuery();

  const eresourcesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
      filterConfig: [{
        name: 'class',
        values: [
          { name: 'package', value: 'org.olf.kb.Pkg' },
          { name: 'nopackage', value: 'org.olf.kb.TitleInstance' },
        ]
      }],
      filterKeys: {
        availability: 'availabilityConstraints.body.value',
        contentType: 'contentTypes.contentType.value',
        remoteKb: 'remoteKb.id',
        scope: 'availabilityScope.value',
        status: 'lifecycleStatus.value',
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [query]);


  const {
    infiniteQueryObject: {
      error: eresourcesError,
      fetchNextPage: fetchNextEresourcesPage,
      isLoading: areEresourcesLoading,
      isError: isEresourcesError
    },
    results: eresources = [],
    total: eresourcesCount = 0
  } = useInfiniteFetch(
    ['ERM', 'EResources', eresourcesQueryParams, ERESOURCES_ELECTRONIC_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...eresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${ERESOURCES_ELECTRONIC_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  useEffect(() => {
    if (eresourcesCount === 1) {
      history.push(`${urls.eresourceView(eresources[0].id)}${location.search}`);
    }
  }, [eresources, eresourcesCount, history, location.search]);

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
        eresources,
        publicationTypeValues: getRefdataValuesByDesc(refdata, PUB_TYPE),
        scopeValues: getRefdataValuesByDesc(refdata, SCOPE),
        sourceValues: kbs,
        statusValues: getRefdataValuesByDesc(refdata, LIFECYCLE_STATUS),
        typeValues: getRefdataValuesByDesc(refdata, TYPE),
        tagsValues: tags,
      }}
      onNeedMoreData={(_askAmount, index) => fetchNextEresourcesPage({ pageParam: index })}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => eresourcesCount,
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

EResourcesRoute.propTypes = {
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

export default EResourcesRoute;
