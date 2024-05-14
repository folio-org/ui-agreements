import { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FormattedMessage, useIntl } from 'react-intl';

import { flatten } from 'lodash';

import {
  downloadBlob,
  useAgreement,
  useChunkedUsers,
  useInterfaces,
  INVALID_JSON_ERROR,
  JSON_ERROR,
  usePrevNextPagination,
} from '@folio/stripes-erm-components';
import { CalloutContext, useOkapiKy } from '@folio/stripes/core';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import View from '../../components/views/Agreement';
import { parseMclPageSize, urls } from '../../components/utilities';
import { joinRelatedAgreements } from '../utilities/processRelatedAgreements';

import {
  AGREEMENT_ENDPOINT,
  AGREEMENT_LINES_ENDPOINT,
  AGREEMENT_LINES_PAGINATION_ID,
  httpStatuses,
} from '../../constants';
import {
  useAgreementsHelperApp,
  useAgreementsSettings,
  useAgreementStore,
  useChunkedOrderLines,
} from '../../hooks';

const AgreementViewRoute = ({
  handlers = {},
  history,
  location,
  match: {
    params: { id: agreementId },
  },
}) => {
  const { checkAndSetAgreementId } = useAgreementStore();

  // React useEffect to check and set the current agreement id
  // in this function the local page store is reset if agreement id has changed
  useEffect(() => {
    checkAndSetAgreementId(agreementId);
  }, [agreementId, checkAndSetAgreementId]);

  const queryClient = useQueryClient();

  const settings = useAgreementsSettings();
  const agreementLinesPageSize = parseMclPageSize(settings, 'agreementLines');

  const { currentPage: agreementLinesPage } = usePrevNextPagination({
    pageSize: agreementLinesPageSize, // Only needed for reading back MCL props
    id: AGREEMENT_LINES_PAGINATION_ID,
    syncToLocation: false,
  });

  const [eresourcesFilterPath, setEresourcesFilterPath] = useState('current');

  const intl = useIntl();

  const callout = useContext(CalloutContext);

  const ky = useOkapiKy();

  const { handleToggleTags, HelperComponent, TagButton } =
    useAgreementsHelperApp();

  const agreementPath = AGREEMENT_ENDPOINT(agreementId);

  const { agreement, isAgreementLoading } = useAgreement({ agreementId });

  const interfaces =
    useInterfaces({
      interfaceIds: flatten(
        (agreement?.orgs ?? []).map(
          (o) => o?.org?.orgsUuid_object?.interfaces ?? []
        )
      ),
    }) ?? [];

  const { mutateAsync: deleteAgreement } = useMutation(
    [agreementPath, 'ui-agreements', 'AgreementViewRoute', 'deleteAgreement'],
    () => ky
      .delete(agreementPath)
      .then(() => queryClient.invalidateQueries(['ERM', 'Agreements']))
  );

  // Users
  const { users } = useChunkedUsers(
    agreement?.contacts?.filter((c) => c.user)?.map((c) => c.user) ?? []
  );
  // AGREEMENT LINES INFINITE FETCH
  const agreementLineQueryParams = useMemo(
    () => generateKiwtQueryParams(
      {
        filters: [
          {
            path: 'owner',
            value: agreementId,
          },
        ],
        sort: [
          { path: 'type' },
          { path: 'resource.name' },
          { path: 'reference' },
          { path: 'id' },
        ],
        page: agreementLinesPage,
        perPage: agreementLinesPageSize,
      },
      {}
    ),
    [agreementId, agreementLinesPageSize, agreementLinesPage]
  );

  const {
    data: {
      results: agreementLines = [],
      totalRecords: agreementLineCount = 0,
    } = {},
    isLoading: areLinesLoading,
  } = useQuery(
    [
      'ERM',
      'Agreement',
      agreementId,
      'AgreementLines',
      AGREEMENT_LINES_ENDPOINT,
      agreementLineQueryParams,
    ],
    () => {
      const params = [...agreementLineQueryParams];
      return ky.get(`${AGREEMENT_LINES_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  /*
   * Calculate poLineIdsArray outside of the useEffect hook,
   * so we can accurately tell if it changes and avoid infinite loop
   */
  const poLineIdsArray = useMemo(
    () => agreementLines
      .filter((line) => line.poLines?.length)
      .map((line) => line.poLines.map((poLine) => poLine.poLineId))
      .flat(),
    [agreementLines]
  );

  const { orderLines, isLoading: areOrderLinesLoading } =
    useChunkedOrderLines(poLineIdsArray);

  const { mutateAsync: cloneAgreement } = useMutation(
    [agreementPath, 'ui-agreements', 'AgreementViewRoute', 'cloneAgreement'],
    (cloneableProperties) => ky
      .post(`${agreementPath}/clone`, { json: cloneableProperties })
      .then((response) => {
        if (response.ok) {
          return response.text(); // Parse it as text
        } else if (response.status === httpStatuses.HTTP_422) {
          // handle 422 error specifically
          return response.json().then(({ errors }) => {
            throw new Error(
              intl.formatMessage(
                {
                  id: `ui-agreements.duplicateAgreementModal.${errors[0].i18n_code}`,
                }, // use the i18n_code to find the corresponding translation
                { name: agreement?.name }
              )
            );
          });
        } else {
          throw new Error(JSON_ERROR);
        }
      })
      .then((text) => {
        const data = JSON.parse(text); // Try to parse it as json
        if (data.id) {
          return Promise.resolve(
            history.push(`${urls.agreementEdit(data.id)}${location.search}`)
          );
        } else {
          throw new Error(INVALID_JSON_ERROR); // when the json response body doesn't contain an id
        }
      })
      .catch((error) => {
        throw error;
      })
  );

  const { refetch: exportAgreement } = useQuery(
    [
      `${agreementPath}/export/current`,
      'ui-agreements',
      'AgreementViewRoute',
      'exportAgreement',
    ],
    () => ky
      .get(`${agreementPath}/export/current`)
      .blob()
      .then(downloadBlob(agreement.name, { fileExt: 'json' }))
      .then(
        callout.sendCallout({
          type: 'success',
          message: (
            <FormattedMessage id="ui-agreements.agreements.exportingAgreement" />
          ),
        })
      ),
    {
      enabled: false,
    }
  );

  const { refetch: exportEresourcesAsJson } = useQuery(
    [
      `${agreementPath}/resources/export/${eresourcesFilterPath}`,
      'ui-agreements',
      'AgreementViewRoute',
      'exportEresourcesJson',
    ],
    () => ky
      .get(`${agreementPath}/resources/export/${eresourcesFilterPath}`)
      .blob()
      .then(downloadBlob(agreement.name, { fileExt: 'json' })),
    {
      enabled: false,
    }
  );

  const { refetch: exportEresourcesAsKBART } = useQuery(
    [
      `${agreementPath}/resources/export/${eresourcesFilterPath}/kbart`,
      'ui-agreements',
      'AgreementViewRoute',
      'exportEresourcesKbart',
    ],
    () => ky
      .get(`${agreementPath}/resources/export/${eresourcesFilterPath}/kbart`)
      .blob()
      .then(downloadBlob(agreement.name, { fileExt: 'txt' })),
    {
      enabled: false,
    }
  );

  const getCompositeAgreement = () => {
    const contacts = agreement.contacts.map((c) => ({
      ...c,
      user: users?.find((user) => user?.id === c.user) || c.user,
    }));

    const orgs = agreement.orgs.map((o) => ({
      ...o,
      interfaces: (o?.org?.orgsUuid_object?.interfaces ?? []).map((id) => ({
        ...(interfaces?.find((int) => int?.id === id) ?? {}),
        /* Credentials are now handled by ViewOrganizationCard directly */
      })),
    }));

    joinRelatedAgreements(agreement);

    return {
      ...agreement,
      contacts,
      lines: !areLinesLoading ? agreementLines : undefined,
      agreementLinesCount: agreementLineCount,
      orderLines,
      orgs,
    };
  };

  const handleClose = () => {
    history.push(`${urls.agreements()}${location.search}`);
  };

  const handleDelete = () => {
    const compositeAgreement = getCompositeAgreement();

    if (compositeAgreement.lines?.length) {
      callout.sendCallout({
        type: 'error',
        timeout: 0,
        message: (
          <FormattedMessage id="ui-agreements.errors.noDeleteHasAgreementLines" />
        ),
      });
      return;
    }

    if (compositeAgreement.linkedLicenses?.length) {
      callout.sendCallout({
        type: 'error',
        timeout: 0,
        message: (
          <FormattedMessage id="ui-agreements.errors.noDeleteHasLicenses" />
        ),
      });
      return;
    }

    if (compositeAgreement.relatedAgreements?.length) {
      callout.sendCallout({
        type: 'error',
        timeout: 0,
        message: (
          <FormattedMessage id="ui-agreements.errors.noDeleteHasRelatedAgreements" />
        ),
      });
      return;
    }

    deleteAgreement()
      .then(() => {
        history.push(`${urls.agreements()}${location.search}`);
        callout.sendCallout({
          message: (
            <FormattedMessage
              id="ui-agreements.agreements.deletedAgreement"
              values={{ name: compositeAgreement.name }}
            />
          ),
        });
      })
      .catch((error) => {
        callout.sendCallout({
          type: 'error',
          timeout: 0,
          message: (
            <FormattedMessage
              id="ui-agreements.errors.noDeleteAgreementBackendError"
              values={{ message: error.message }}
            />
          ),
        });
      });
  };

  const handleFilterEResources = (path) => {
    setEresourcesFilterPath(path);
  };

  const handleEdit = () => {
    history.push(`${urls.agreementEdit(agreementId)}${location.search}`);
  };

  const handleViewAgreementLine = (lineId) => {
    history.push(
      `${urls.agreementLineView(agreementId, lineId)}${location.search}`
    );
  };

  const isPaneLoading = () => {
    return agreementId !== agreement?.id && isAgreementLoading;
  };

  return (
    <View
      key={`agreement-view-pane-${agreementId}`}
      components={{
        HelperComponent,
        TagButton,
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
        onClose: handleClose,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onExportAgreement: exportAgreement,
        onExportEResourcesAsJSON: exportEresourcesAsJson,
        onExportEResourcesAsKBART: exportEresourcesAsKBART,
        onFilterEResources: handleFilterEResources,
        onToggleTags: handleToggleTags,
        onViewAgreementLine: handleViewAgreementLine,
      }}
      isLoading={isPaneLoading() || areOrderLinesLoading}
    />
  );
};

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
    }).isRequired,
  }).isRequired,
};

export default AgreementViewRoute;
