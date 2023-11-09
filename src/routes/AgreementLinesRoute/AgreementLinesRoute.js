import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import {
  useTags,
  usePrevNextPagination
} from '@folio/stripes-erm-components';

import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';
import { useQuery } from 'react-query';

import View from '../../components/views/AgreementLines';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import { AGREEMENT_LINES_ENDPOINT, resultCount } from '../../constants';
import { useEresourcesEnabled } from '../../hooks';

const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const AgreementLinesRoute = ({
  children,
  history,
  location,
  match
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
  const eresourcesEnabled = useEresourcesEnabled();
  const { currentPage } = usePrevNextPagination();

  const searchKey = eresourcesEnabled ? 'resource.name,reference,description,note' : 'reference,description,note';

  const agreementLinesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey,
      filterKeys: {
        agreement: 'owner.id',
        // DO NOT INCLUDE "lineType" as filterKey, so that the values will be passed as is to the backend
        poLine: 'poLines.poLineId',
        tags: 'tags.value',
      },
      page: currentPage,
      perPage: RESULT_COUNT_INCREMENT_MEDIUM,
      fetchExternalResources: false,
    }, (query ?? {}))
  ), [query, searchKey, currentPage]);

  const {
    data: { results: agreementLines = [], totalRecords: agreementLinesCount = 0 } = {},
    error: agreementLinesError,
    isError: isAgreementLinesError,
    isIdle: isAgreementLinesIdle,
    isLoading: areAgreementLinesLoading
  } = useQuery(
    ['ERM', 'AgreementLines', agreementLinesQueryParams, AGREEMENT_LINES_ENDPOINT],
    () => {
      const params = [...agreementLinesQueryParams];
      return ky.get(`${AGREEMENT_LINES_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: (!!query?.filters || !!query?.query) && !!currentPage
    }
  );

  useEffect(() => {
    if (agreementLinesCount === 1) {
      history.push(`${urls.agreementLineNativeView(agreementLines[0].owner.id, agreementLines[0].id)}${location.search}`);
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
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
      searchString={location.search}
      selectedRecordId={match.params.lineId}
      source={{ // Fake source from useQuery return values;
        totalCount: () => agreementLinesCount,
        loaded: () => !isAgreementLinesIdle,
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


