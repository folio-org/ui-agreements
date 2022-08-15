import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { useTags, useInfiniteFetch } from '@folio/stripes-erm-components';

import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import View from '../../components/views/AgreementLines';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resultCount } from '../../constants';
import { AGREEMENT_LINES_ENDPOINT } from '../../constants/endpoints';

const {
  INITIAL_RESULT_COUNT,
} = resultCount;

const AgreementLinesRoute = ({
  children,
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-agreements.agreements.view');
  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);  // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const { data: { tags = [] } = {} } = useTags();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();

  const agreementLinesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,description,note',
      filterKeys: {
        name: 'class',
        agreement: 'agreement.value',
        agreementLinesType: 'agreementLinesType.type',
        activeFrom: 'activeFrom.value',
        activeTo: 'activeTo.value',
        poLine: 'poLines.value',
        tags: 'tags.value',
      },
      perPage: INITIAL_RESULT_COUNT
    }, (query ?? {}))
  ), [query]);

  const {
    infiniteQueryObject: {
      error: agreementLinesError,
      fetchNextPage: fetchNextAgreementLinePage,
      isLoading: areAgreementLinesLoading,
      isError: isAgreementLinesError
    },
    results: agreementLines = [],
    total: agreementLinesCount = 0
  } = useInfiniteFetch(
    ['ERM', 'AgreementLines', agreementLinesQueryParams, AGREEMENT_LINES_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...agreementLinesQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${AGREEMENT_LINES_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  useEffect((lineId) => {
    if (agreementLinesCount === 1) {
      history.push(`${urls.agreementLineView(lineId)}${location.search}`);
    }
  }, [agreementLines, agreementLinesCount, history, location.search]);

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        agreementLines,
        tagsValues: tags,
      }}
      history={history}
      onNeedMoreData={(_askAmount, index) => fetchNextAgreementLinePage({ pageParam: index })}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
      searchString={location.search}
      selectedRecordId={match.params.lineId}
      source={{ // Fake source from useQuery return values;
        totalCount: () => agreementLinesCount,
        loaded: () => !areAgreementLinesLoading,
        pending: () => areAgreementLinesLoading,
        failure: () => isAgreementLinesError,
        failureMessage: () => agreementLinesError.message
      }}
    >
      {children}
    </View>
  );
};
AgreementLinesRoute.propTypes = {
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
      lineId: PropTypes.string,
    }).isRequired
  }).isRequired,
};

export default AgreementLinesRoute;


