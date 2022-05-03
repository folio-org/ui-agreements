import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { FormattedMessage } from 'react-intl';

import compose from 'compose-function';
import { chunk } from 'lodash';

import { CalloutContext, stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import View from '../../components/views/AgreementLine';
import { urls, withSuppressFromDiscovery } from '../../components/utilities';
import { resultCount } from '../../constants';

import { useAgreementsHelperApp } from '../../hooks';

const { RECORDS_PER_REQUEST_LARGE } = resultCount;

const AgreementLineViewRoute = ({
  handlers,
  history,
  isSuppressFromDiscoveryEnabled,
  location,
  match: { params: { agreementId, lineId } },
  mutator,
  tagsEnabled
}) => {
  const [orderLines, setOrderLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const callout = useContext(CalloutContext);
  const queryClient = useQueryClient();

  const ky = useOkapiKy();

  const agreementLinesPath = 'erm/entitlements';
  const agreementLinePath = `${agreementLinesPath}/${lineId}`;


  const { data: agreementLine = {}, isLoading: isLineQueryLoading } = useQuery(
    [agreementLinePath, 'ui-agreements', 'AgreementLineViewRoute', 'getLine'],
    () => ky.get(agreementLinePath).json()
  );

  const { mutateAsync: deleteAgreementLine } = useMutation(
    [agreementLinePath, 'ui-agreements', 'AgreementLineViewRoute', 'deleteAgreementLine'],
    () => ky.put(agreementLinePath, {
      id: agreementId,
      items: [{ id: lineId, _delete: true }]
    }).then(() => {
      queryClient.invalidateQueries(agreementLinesPath);
      history.push(`${urls.agreementView(agreementId)}${location.search}`);
      callout.sendCallout({ message: <FormattedMessage id="ui-agreements.line.delete.callout" /> });
    }).catch(error => {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.line.deleteFailed.callout" values={{ message: error.message }} /> });
    })
  );

  const {
    handleToggleTags,
    HelperComponent,
    TagButton,
  } = useAgreementsHelperApp(tagsEnabled);

  // On mount, fetch order lines and then set states
  useEffect(() => {
    const fetchOrderLines = async () => {
      const poLineIdsArray = (agreementLine.poLines ?? []).map(poLine => poLine.poLineId).flat();

      const CONCURRENT_REQUESTS = 5; // Number of requests to make concurrently
      const STEP_SIZE = 60; // Number of ids to request for per concurrent request

      const chunkedItems = chunk(poLineIdsArray, CONCURRENT_REQUESTS * STEP_SIZE); // Split into chunks of size CONCURRENT_REQUESTS * STEP_SIZE
      const data = [];
      for (const chunkedItem of chunkedItems) {  // Make requests concurrently
        mutator.orderLines.reset();
        const promisesArray = []; // Array of promises
        for (let i = 0; i < chunkedItem.length; i += STEP_SIZE) {
          promisesArray.push( // Add promises to array
            mutator.orderLines.GET({ // Make GET request
              params: {
                query: chunkedItem.slice(i, i + STEP_SIZE).map(item => `id==${item}`).join(' or '), // Make query string
                limit: 1000, // Limit to 1000
              },
            })
          );
        }
        const results = await Promise.all(promisesArray); // Wait for all requests to complete and move to the next chunk
        data.push(...results.flat()); // Add results to data
      }

      return data;
    };

    setOrderLines(fetchOrderLines());
    setIsLoading(false);
  }, [agreementLine.poLines, mutator.orderLines]);

  const getCompositeLine = () => {
    const poLines = (agreementLine.poLines || [])
      .map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId))
      .filter(poLine => poLine);

    return {
      ...agreementLine,
      poLines,
    };
  };

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };


  const handleEdit = () => {
    history.push(`${urls.agreementLineEdit(agreementId, lineId)}${location.search}`);
  };

  const isLineLoading = () => {
    return (
      lineId !== agreementLine?.id && isLineQueryLoading
    );
  };

  return (
    <View
      key={`agreement-line-view-pane-${lineId}`}
      components={{
        TagButton,
        HelperComponent
      }}
      data={{
        line: getCompositeLine(),
        tagsLink: agreementLinePath
      }}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onClose: handleClose,
        onDelete: deleteAgreementLine,
        onEdit: handleEdit,
        onToggleTags: handleToggleTags
      }}
      isLoading={isLineLoading() || isLoading}
    />
  );
};

AgreementLineViewRoute.manifest = Object.freeze({
  orderLines: {
    type: 'okapi',
    perRequest: RECORDS_PER_REQUEST_LARGE,
    path: 'orders/order-lines',
    accumulate: true,
    fetch: false,
    records: 'poLines',
    throwErrors: false,
  }
});

AgreementLineViewRoute.propTypes = {
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
      agreementId: PropTypes.string.isRequired,
      lineId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
  mutator: PropTypes.shape({
    orderLines: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func
    }),
  }).isRequired,
  resources: PropTypes.shape({
    orderLines: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  tagsEnabled: PropTypes.bool,
};

export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
  withTags,
)(AgreementLineViewRoute);
