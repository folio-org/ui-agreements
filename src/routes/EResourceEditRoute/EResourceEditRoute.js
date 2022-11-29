import React from 'react';
import PropTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import PCIForm from '../../components/views/PCIForm';
import TitleForm from '../../components/views/TitleForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resourceClasses } from '../../constants';
import { useSuppressFromDiscovery } from '../../hooks';
import { ERESOURCE_ENDPOINT, PCI_ENDPOINT, TITLE_ENDPOINT } from '../../constants/endpoints';

const EResourceEditRoute = ({
  handlers,
  history,
  location,
  match: { params: { id: eresourceId } },
}) => {
  const stripes = useStripes();
  const isSuppressFromDiscoveryEnabled = useSuppressFromDiscovery();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const eresourcePath = ERESOURCE_ENDPOINT(eresourceId);
  const { data: eresource = {}, isLoading: isEresourceLoading } = useQuery(
    [eresourcePath, 'getEresource'],
    () => ky.get(eresourcePath).json()
  );
  const eresourceClass = eresource?.class;

  // We currently only have edit for non-package eresources
  const historyUrl = `${urls.titleView(eresourceId)}${location.search}`;

  const { mutateAsync: putPCI } = useMutation(
    [PCI_ENDPOINT(eresourceId), 'ui-agreements', 'AgreementEditRoute', 'editAgreement'],
    (payload) => ky.put(PCI_ENDPOINT(eresourceId), { json: payload }).json()
  );

  const { mutateAsync: putTitle } = useMutation(
    [TITLE_ENDPOINT(eresourceId), 'ui-agreements', 'AgreementEditRoute', 'editAgreement'],
    (payload) => ky.put(TITLE_ENDPOINT(eresourceId), { json: payload }).json()
  );

  const handleClose = () => {
    history.push(historyUrl);
  };

  const handleSubmit = (values) => {
    const { coverage, id, suppressFromDiscovery } = values;

    let putFunc;

    if (eresourceClass === resourceClasses.TITLEINSTANCE) {
      putFunc = () => putTitle({
        id,
        suppressFromDiscovery
      });
    } else {
      putFunc = () => putPCI({
        id,
        coverage,
        suppressFromDiscovery
      });
    }

    putFunc().then(() => {
      /* Invalidate cached queries */
      queryClient.invalidateQueries(ERESOURCE_ENDPOINT(eresourceId));

      history.push(historyUrl);
    });
  };

  if (!stripes.hasPerm('ui-agreements.resources.edit')) return <NoPermissions />;
  if (isEresourceLoading) return <LoadingView dismissible onClose={handleClose} />;

  const EResourceViewComponent = eresourceClass === resourceClasses.TITLEINSTANCE ? TitleForm : PCIForm;

  return (
    <EResourceViewComponent
      eresource={eresource}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onClose: handleClose,
      }}
      initialValues={eresource}
      onSubmit={handleSubmit}
    />
  );
};

export default EResourceEditRoute;

EResourceEditRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
