import React, { useEffect, useMemo, useRef } from 'react';

import { useQuery } from 'react-query';
import PropTypes from 'prop-types';

import {
  generateKiwtQueryParams,
  useKiwtSASQuery
} from '@k-int/stripes-kint-components';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import {
  getRefdataValuesByDesc,
  usePrevNextPagination,
  useSASQQIndex,
  useTags
} from '@folio/stripes-erm-components';

import View from '../../components/views/Titles';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import {
  defaultTitlesQIndex as defaultQIndex,
  resultCount,
  TITLES_ELECTRONIC_ENDPOINT
} from '../../constants';
import { useAgreementsRefdata } from '../../hooks';

const RESULT_COUNT_INCREMENT = resultCount.RESULT_COUNT_INCREMENT_MEDIUM;

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

  const { currentPage } = usePrevNextPagination();
  const { searchKey } = useSASQQIndex({ defaultQIndex });

  const titlesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey,
      filterKeys: {
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      page: currentPage,
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [currentPage, query, searchKey]);

  const {
    data: { results: titles = [], totalRecords: titlesCount = 0 } = {},
    error: titlesError,
    isLoading: areTitlesLoading,
    isError: isTitlesError
  } = useQuery(
    ['ERM', 'Titles', titlesQueryParams, TITLES_ELECTRONIC_ENDPOINT],
    () => {
      const params = [...titlesQueryParams];
      return ky.get(`${TITLES_ELECTRONIC_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: (!!query?.filters || !!query?.query) && !!currentPage,
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
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
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
