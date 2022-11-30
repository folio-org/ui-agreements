import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useTags, useInfiniteFetch } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import View from '../../components/views/Titles';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resultCount } from '../../constants';

import { TITLES_ENDPOINT } from '../../constants/endpoints';
import { useAgreementsRefdata } from '../../hooks';

const RESULT_COUNT_INCREMENT = resultCount.RESULT_COUNT_INCREMENT;

const [
  PUB_TYPE,
  TYPE
] = [
  'TitleInstance.PublicationType',
  'TitleInstance.Type',
];

const TitlesRoute = ({
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
      PUB_TYPE,
      TYPE
    ]
  });

  const { data: { tags = [] } = {} } = useTags();
  const { query, querySetter, queryGetter } = useKiwtSASQuery();

  const titlesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
      filterKeys: {
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      filters: [
        {
          path: 'subType.value',
          value: 'electronic'
        }
      ],
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [query]);


  const {
    infiniteQueryObject: {
      error: titlesError,
      fetchNextPage: fetchNextTitlesPage,
      isLoading: areTitlesLoading,
      isError: isTitlesError
    },
    results: titles = [],
    total: titlesCount = 0
  } = useInfiniteFetch(
    ['ERM', 'Titles', titlesQueryParams, TITLES_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...titlesQueryParams, `offset=${pageParam}`];
      return ky.get(`${TITLES_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: !!query?.filters || !!query?.query
    }
  );

  useEffect(() => {
    if (titlesCount === 1) {
      history.push(`${urls.titleView(titles[0].id)}${location.search}`);
    }
  }, [titles, titlesCount, history, location.search]);

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        titles,
        publicationTypeValues: getRefdataValuesByDesc(refdata, PUB_TYPE),
        typeValues: getRefdataValuesByDesc(refdata, TYPE),
        tagsValues: tags,
      }}
      onNeedMoreData={(_askAmount, index) => fetchNextTitlesPage({ pageParam: index })}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => titlesCount,
        loaded: () => !areTitlesLoading,
        pending: () => areTitlesLoading,
        failure: () => isTitlesError,
        failureMessage: () => titlesError.message
      }}
    >
      {children}
    </View>
  );
};

TitlesRoute.propTypes = {
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

export default TitlesRoute;
