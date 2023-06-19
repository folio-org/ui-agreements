import React, { useEffect, useMemo, useRef, useState } from 'react';
import queryString from 'query-string';

import { useQuery } from 'react-query';
import PropTypes from 'prop-types';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useTags } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import View from '../../components/views/Titles';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { pagination, resultCount } from '../../constants';

import { TITLES_ELECTRONIC_ENDPOINT } from '../../constants/endpoints';
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

  const urlQuery = queryString.parse(location.search);
  console.log('urlQuery %o', urlQuery);
  const [currentPage, setCurrentPage] = useState(0);

  const titlesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
      filterKeys: {
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      page: currentPage,
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [query, currentPage]);

  const handlePageChange = (direction) => {
    let newPage;
    if (direction === pagination.NEXT) {
      newPage = Number(currentPage) + 1;
    } else if (direction === pagination.PREV) {
      newPage = Number(currentPage) - 1;
    }
    // setCurrentPage(newPage); add useEffect
    if (newPage !== urlQuery?.page) {
      const newQuery = {
        ...urlQuery,
        page: newPage
      };
      history.push({
        pathname: location.pathname,
        search: `?${queryString.stringify(newQuery)}`
      });
    }
  };

  const {
    data: { page, results: titles = [], totalRecords: titlesCount = 0 } = {},
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
      enabled: !!query?.filters || !!query?.query,
    }
  );
  console.log('page from useQuery %o', page);

  useEffect(() => {
    if (urlQuery?.page && currentPage !== urlQuery?.page) {
      console.log('urlQuery?.page', urlQuery?.page);
      setCurrentPage(urlQuery?.page);
      console.log('set currentPage %o', currentPage, 'to', urlQuery?.page);
    } else if (!urlQuery?.page && titles.length) {
      setCurrentPage(1);
      console.log('set currentPage to 1');
    }
  }, [
    currentPage,
    // history,
    // location,
    titles.length,
    urlQuery.page,
  ]);

  // useEffect(() => {
  //   // reset page param in query when filters or searchquery change
  //   console.log('reset page');
  //   setCurrentPage();
  //   const { page, ...unsetPageQuery } = query;
  //   history.push({
  //     pathname: location.pathname,
  //     search: `?${queryString.stringify(unsetPageQuery)}`
  //   });
  // }, [query?.filters, query?.query]);

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
      onNeedMoreData={(...args) => {
        if (args[3]) {
          handlePageChange(args[3]);
        }
      }}
      page={page}
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
