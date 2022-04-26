import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { useTags } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, refdataOptions, useRefdata } from '@k-int/stripes-kint-components';

import View from '../../components/views/EResources';
import NoPermissions from '../../components/NoPermissions';
import { getRefdataValuesByDesc, urls } from '../../components/utilities';
import { resultCount } from '../../constants';

import { useInfiniteFetch } from '../../hooks';
import { REFDATA_ENDPOINT } from '../../constants/endpoints';

const RESULT_COUNT_INCREMENT = resultCount.RESULT_COUNT_INCREMENT;

const [
  PUB_TYPE,
  TYPE
] = [
  'TitleInstance.PublicationType',
  'TitleInstance.Type',
];

const EResourcesRoute = ({
  children,
  history,
  location,
  match,
  mutator,
  resources,
  stripes
}) => {
  const ky = useOkapiKy();
  const hasPerms = stripes.hasPerm('ui-agreements.agreements.view');
  const searchField = useRef();


  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const refdata = useRefdata({
    desc: [
      PUB_TYPE,
      TYPE
    ],
    endpoint: REFDATA_ENDPOINT,
    options: { ...refdataOptions, sort: [{ path: 'desc' }] }
  });

  const { data: { tags = [] } = {} } = useTags();


  const eresourcesPath = 'erm/resource/electronic';

  const eresourcesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value',
      filterConfig: [{
        name: 'class',
        values: [
          { name: 'package', value: 'org.olf.kb.Pkg' },
          { name: 'nopackage', value: 'org.olf.kb.TitleInstance' },
        ]
      }],
      filterKeys: {
        remoteKb: 'remoteKb.id',
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      perPage: RESULT_COUNT_INCREMENT
    }, (resources?.query ?? {}))
  ), [resources?.query]);


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
    [eresourcesPath, eresourcesQueryParams, 'ui-agreements', 'EresourcesRoute', 'getEresources'],
    ({ pageParam = 0 }) => {
      const params = [...eresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${eresourcesPath}?${params?.join('&')}`)).json();
    }
  );

  useEffect(() => {
    if (eresourcesCount === 1) {
      history.push(`${urls.eresourceView(eresources[0].id)}${location.search}`);
    }
  }, [eresources, eresourcesCount, history, location.search]);

  const kbsPath = 'erm/kbs';
  const { data: kbs = [] } = useQuery(
    [kbsPath, 'ui-agreements', 'EresourcesRoute', 'getKbs'],
    () => ky.get(kbsPath).json()
  );

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
        eresources,
        publicationTypeValues: getRefdataValuesByDesc(refdata, PUB_TYPE),
        sourceValues: kbs,
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

EResourcesRoute.manifest = Object.freeze({
  query: { initialValue: {} },
});

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
  mutator: PropTypes.object,
  resources: PropTypes.object,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.object,
  }),
};

export default stripesConnect(EResourcesRoute);
