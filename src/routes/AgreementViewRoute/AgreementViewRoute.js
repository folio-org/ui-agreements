import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FormattedMessage, useIntl } from 'react-intl';

import { get, flatten, uniqBy } from 'lodash';

import { CalloutContext, stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { useAgreement, useInfiniteFetch, useUsers } from '@folio/stripes-erm-components';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import View from '../../components/views/Agreement';
import { parseMclPageSize, urls } from '../../components/utilities';
import { errorTypes, resultCount } from '../../constants';

import { joinRelatedAgreements } from '../utilities/processRelatedAgreements';

import { useAgreementsHelperApp, useAgreementsSettings, useChunkedOrderLines } from '../../hooks';
import { AGREEMENT_ENDPOINT, AGREEMENT_ERESOURCES_ENDPOINT, AGREEMENT_LINES_ENDPOINT } from '../../constants/endpoints';

const { RECORDS_PER_REQUEST_MEDIUM } = resultCount;

const credentialsArray = [];
const AgreementViewRoute = ({
  handlers = {},
  history,
  location,
  match: { params: { id: agreementId } },
  mutator,
  resources,
}) => {
  const queryClient = useQueryClient();

  const [eresourcesFilterPath, setEresourcesFilterPath] = useState('current');

  const intl = useIntl();

  const callout = useContext(CalloutContext);

  const ky = useOkapiKy();

  const {
    handleToggleTags,
    HelperComponent,
    TagButton,
  } = useAgreementsHelperApp();

  const agreementPath = AGREEMENT_ENDPOINT(agreementId);
  const agreementEresourcesPath = AGREEMENT_ERESOURCES_ENDPOINT(agreementId, eresourcesFilterPath);

  const { agreement, isAgreementLoading } = useAgreement({ agreementId });

  const { mutateAsync: deleteAgreement } = useMutation(
    [agreementPath, 'ui-agreements', 'AgreementViewRoute', 'deleteAgreement'],
    () => ky.delete(agreementPath).then(() => queryClient.invalidateQueries(['ERM', 'Agreements']))
  );

  const settings = useAgreementsSettings();

  // Users
  const { data: { users = [] } = {} } = useUsers(agreement?.contacts?.filter(c => c.user)?.map(c => c.user));

  // AGREEMENT LINES INFINITE FETCH
  const agreementLineQueryParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        filters: [
          {
            path: 'owner',
            value: agreementId
          }
        ],
        sort: [
          { path: 'type' },
          { path: 'resource.name' },
          { path: 'reference' },
          { path: 'id' }
        ],
        perPage: parseMclPageSize(settings, 'agreementLines')
      },
      {}
    )
  ), [agreementId, settings]);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextLinesPage,
      isLoading: areLinesLoading
    },
    results: agreementLines = [],
    total: agreementLineCount = 0
  } = useInfiniteFetch(
    ['ERM', 'Agreement', agreementId, 'AgreementLines', AGREEMENT_LINES_ENDPOINT, agreementLineQueryParams],
    ({ pageParam = 0 }) => {
      const params = [...agreementLineQueryParams, `offset=${pageParam}`];
      return ky.get(`${AGREEMENT_LINES_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  // AGREEMENT ERESOURCES INFINITE FETCH
  const agreementEresourcesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      sort: [
        { path: 'pti.titleInstance.name' }
      ],
      perPage: parseMclPageSize(settings, 'agreementEresources')
    }, {})
  ), [settings]);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextEresourcePage,
      isLoading: areEresourcesLoading
    },
    results: agreementEresources = [],
    total: agreementEresourcesCount = 0
  } = useInfiniteFetch(
    [agreementEresourcesPath, agreementEresourcesQueryParams, 'ui-agreements', 'AgreementViewRoute', 'getEresources'],
    ({ pageParam = 0 }) => {
      const params = [...agreementEresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(`${agreementEresourcesPath}?${params?.join('&')}`).json();
    }
  );

  /*
   * Calculate poLineIdsArray outside of the useEffect hook,
   * so we can accurately tell if it changes and avoid infinite loop
   */
  const poLineIdsArray = useMemo(() => (
    agreementLines
      .filter(line => line.poLines && line.poLines.length)
      .map(line => (line.poLines.map(poLine => poLine.poLineId))).flat()
  ), [agreementLines]);

  const { orderLines, isLoading: areOrderLinesLoading } = useChunkedOrderLines(poLineIdsArray);

  const { mutateAsync: cloneAgreement } = useMutation(
    [agreementPath, 'ui-agreements', 'AgreementViewRoute', 'cloneAgreement'],
    (cloneableProperties) => ky.post(`${agreementPath}/clone`, { json: cloneableProperties }).then(response => {
      if (response.ok) {
        return response.text(); // Parse it as text
      } else if (response.status === 422) { // handle 422 error specifically
        return response.json()
          .then(({ errors }) => {
            throw new Error(intl.formatMessage(
              { id: `ui-agreements.duplicateAgreementModal.${errors[0].i18n_code}` }, // use the i18n_code to find the corresponding translation
              { name: agreement?.name },
            ));
          });
      } else {
        throw new Error(errorTypes.JSON_ERROR);
      }
    }).then(text => {
      const data = JSON.parse(text); // Try to parse it as json
      if (data.id) {
        return Promise.resolve(history.push(`${urls.agreementEdit(data.id)}${location.search}`));
      } else {
        throw new Error(errorTypes.INVALID_JSON_ERROR); // when the json response body doesn't contain an id
      }
    }).catch(error => {
      throw error;
    })
  );

  const downloadBlob = (name) => (
    blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  );

  const { refetch: exportAgreement } = useQuery(
    [`${agreementPath}/export/current`, 'ui-agreements', 'AgreementViewRoute', 'exportAgreement'],
    () => ky.get(`${agreementPath}/export/current`).blob().then(downloadBlob(agreement.name)),
    {
      enabled: false
    }
  );

  const { refetch: exportEresourcesAsJson } = useQuery(
    [`${agreementPath}/resources/export/${eresourcesFilterPath}`, 'ui-agreements', 'AgreementViewRoute', 'exportEresourcesJson'],
    () => ky.get(`${agreementPath}/resources/export/${eresourcesFilterPath}`).blob().then(downloadBlob(agreement.name)),
    {
      enabled: false
    }
  );

  const { refetch: exportEresourcesAsKBART } = useQuery(
    [`${agreementPath}/resources/export/${eresourcesFilterPath}/kbart`, 'ui-agreements', 'AgreementViewRoute', 'exportEresourcesKbart'],
    () => ky.get(`${agreementPath}/resources/export/${eresourcesFilterPath}/kbart`).blob().then(downloadBlob(agreement.name)),
    {
      enabled: false
    }
  );

  const getRecord = (id, resourceType) => {
    return get(resources, `${resourceType}.records`, [])
      .find(i => i.id === id);
  };

  const getCompositeAgreement = () => {
    const contacts = agreement.contacts.map(c => ({
      ...c,
      user: users?.find(user => user?.id === c.user) || c.user,
    }));

    const interfacesCredentials = uniqBy(get(resources, 'interfacesCredentials.records', []), 'id');

    if (interfacesCredentials[0]) {
      const index = credentialsArray.findIndex(object => object.id === interfacesCredentials[0].id);
      if (index === -1) {
        credentialsArray.push(interfacesCredentials[0]);
      }
    }

    const orgs = agreement.orgs.map(o => ({
      ...o,
      interfaces: get(o, 'org.orgsUuid_object.interfaces', [])
        .map(id => ({
          ...getRecord(id, 'interfaces') || {},
          credentials: credentialsArray.find(cred => cred.interfaceId === id)
        })),
    }));

    joinRelatedAgreements(agreement);

    return {
      ...agreement,
      contacts,
      lines: !areLinesLoading ? agreementLines : undefined,
      agreementLinesCount: agreementLineCount,
      eresources: !areEresourcesLoading ? agreementEresources : undefined,
      eresourcesCount: agreementEresourcesCount,
      orderLines,
      orgs,
    };
  };

  const handleClose = () => {
    history.push(`${urls.agreements()}${location.search}`);
  };

  const handleDelete = () => {
    const compositeAgreement = getCompositeAgreement();

    if (compositeAgreement.items?.length) {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.errors.noDeleteHasAgreementLines" /> });
      return;
    }

    if (compositeAgreement.linkedLicenses?.length) {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.errors.noDeleteHasLicenses" /> });
      return;
    }

    if (compositeAgreement.relatedAgreements?.length) {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.errors.noDeleteHasRelatedAgreements" /> });
      return;
    }

    deleteAgreement().then(() => {
      history.push(`${urls.agreements()}${location.search}`);
      callout.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.deletedAgreement" values={{ name: compositeAgreement.name }} /> });
    }).catch(error => {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.errors.noDeleteAgreementBackendError" values={{ message: error.message }} /> });
    });
  };

  const exportAgreementAsJSON = () => {
    callout.sendCallout({ type: 'success', message: <FormattedMessage id="ui-agreements.agreements.exportingAgreement" /> });
  };

  const handleFilterEResources = (path) => {
    setEresourcesFilterPath(path);
  };

  const handleEdit = () => {
    history.push(`${urls.agreementEdit(agreementId)}${location.search}`);
  };

  const handleFetchCredentials = (id) => {
    mutator.interfaceRecord.replace({ id });
  };

  const handleViewAgreementLine = (lineId) => {
    history.push(`${urls.agreementLineView(agreementId, lineId)}${location.search}`);
  };

  const isPaneLoading = () => {
    return (
      agreementId !== agreement?.id &&
      isAgreementLoading
    );
  };

  return (
    <View
      key={`agreement-view-pane-${agreementId}`}
      components={{
        HelperComponent,
        TagButton
      }}
      data={{
        agreement: getCompositeAgreement(),
        eresourcesFilterPath,
        searchString: location.search,
        tagsLink: agreementPath,
        tagsInvalidateLinks: [['ERM', 'Agreement', agreementId]],
      }}
      handlers={{
        ...handlers,
        onClone: cloneAgreement,
        onExportAgreementAsJSON: exportAgreementAsJSON,
        onClose: handleClose,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onExportAgreement: exportAgreement,
        onExportEResourcesAsJSON: exportEresourcesAsJson,
        onExportEResourcesAsKBART: exportEresourcesAsKBART,
        onFetchCredentials: handleFetchCredentials,
        onFilterEResources: handleFilterEResources,
        onNeedMoreEResources: (_askAmount, index) => fetchNextEresourcePage({ pageParam: index }),
        onNeedMoreLines: (_askAmount, index) => fetchNextLinesPage({ pageParam: index }),
        onToggleTags: handleToggleTags,
        onViewAgreementLine: handleViewAgreementLine,
      }}
      isLoading={isPaneLoading() || areOrderLinesLoading}
    />
  );
};

AgreementViewRoute.manifest = Object.freeze({
  interfaces: { // We can and shouold migrate these to react-query at some point as a separate task
    type: 'okapi',
    path: 'organizations-storage/interfaces',
    perRequest: RECORDS_PER_REQUEST_MEDIUM,
    params: (_q, _p, _r, _l, props) => {
      const orgs = get(props.resources, 'agreement.records[0].orgs', []);
      const interfaces = flatten(orgs.map(o => get(o, 'org.orgsUuid_object.interfaces', [])));
      const query = [
        ...new Set(interfaces.map(i => `id==${i}`))
      ].join(' or ');

      return query ? { query } : {};
    },
    fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '2.0'),
    permissionsRequired: 'organizations-storage.interfaces.collection.get',
    records: 'interfaces',
  },
  interfacesCredentials: {
    clientGeneratePk: false,
    throwErrors: false,
    path: 'organizations-storage/interfaces/%{interfaceRecord.id}/credentials',
    type: 'okapi',
    pk: 'FAKE_PK',  // it's done to fool stripes-connect not to add cred id to the path's end.
    permissionsRequired: 'organizations-storage.interfaces.credentials.item.get',
    fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '1.0 2.0'),
  },
  interfaceRecord: {},
});

AgreementViewRoute.propTypes = {
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
    }).isRequired
  }).isRequired,
  mutator: PropTypes.shape({
    interfaceRecord: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }),
  resources: PropTypes.shape({
    interfaces: PropTypes.object,
    query: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesConnect(AgreementViewRoute);
