import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  HasCommand,
  Icon,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections
} from '@folio/stripes/components';
import { AppIcon, TitleManager, HandlerManager, useStripes } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import { AccessControl, AccessControlErrorPane } from '@folio/stripes-erm-components';

import { CustomPropertiesView, useCustomProperties } from '@k-int/stripes-kint-components';

import DuplicateAgreementModal from '../../DuplicateAgreementModal';

import {
  AllPeriods,
  ControllingLicense,
  ExternalLicenses,
  FutureLicenses,
  Header,
  HistoricalLicenses,
  Info,
  InternalContacts,
  Lines,
  Organizations,
  RelatedAgreements,
  SupplementaryDocs,
  Terms,
  UsageData,
} from '../../AgreementSections';

import {
  useAgreementsContexts,
  useChunkedOrderLines,
  useHasLicensesInterface
} from '../../../hooks';

import { urls } from '../../utilities';
import {
  AGREEMENT_ENTITY_TYPE,
  CUSTPROP_ENDPOINT,
  LICENSE_CUSTPROP_ENDPOINT,
  statuses
} from '../../../constants';

const Agreement = ({
  accessControlData: {
    canRead,
    canReadLoading,
    canEdit,
    canEditLoading,
    canDelete,
    canDeleteLoading
  } = {
    canRead: true,
    canReadLoading: false,
    canEdit: true,
    canEditLoading: false,
    canDelete: true,
    canDeleteLoading: false
  }, // If not passed, assume everything is accessible and not loading...?
  components: {
    HelperComponent,
    TagButton
  },
  data,
  isLoading,
  handlers,
}) => {
  const poLineIdsArray = useMemo(
    () => data.agreement?.lines?.filter((line) => line.poLines?.length)
      .map((line) => line.poLines.map((poLine) => poLine.poLineId))
      .flat() || [],
    [data.agreement.lines]
  );

  const { orderLines, isLoading: areOrderLinesLoading } =
    useChunkedOrderLines(poLineIdsArray);

  const accordionStatusRef = useRef();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [showDuplicateAgreementModal, setShowDuplicateAgreementModal] = useState(false);

  const licenses = data.agreement?.linkedLicenses || [];
  const controllingLicenses = licenses.filter(l => l.status.value === statuses.CONTROLLING);
  const futureLicenses = licenses.filter(l => l.status.value === statuses.FUTURE);
  const historicalLicenses = licenses.filter(l => l.status.value === statuses.HISTORICAL);

  const stripes = useStripes();

  const { hasLicensesInterface } = useHasLicensesInterface();

  const { data: custpropContexts = [] } = useAgreementsContexts();
  // Ensure the custprops with no contexts get rendered
  const contexts = ['isNull', ...custpropContexts];

  const { data: terms } = useCustomProperties({
    endpoint: LICENSE_CUSTPROP_ENDPOINT,
    options: {
      sort: [
        { path: 'retired' }, // Place retired custprops at the end
        { path: 'primary', direction: 'desc' }, // Primary properties should display before optional
        { path: 'label' } // Within those groups, sort by label
      ]
    },
    queryParams: {
      enabled: licenses?.length > 0 && hasLicensesInterface
    },
    returnQueryObject: true,
  });

  const getSectionProps = (id) => {
    return {
      agreement: {
        ...data.agreement,
        orderLines: orderLines || [],
        areOrderLinesLoading
      },
      data,
      eresourcesFilterPath: data.eresourcesFilterPath,
      id,
      handlers,
      searchString: data.searchString,
      terms
    };
  };

  const getActionMenu = ({ onToggle }) => {
    const buttons = [];
    console.log('Permissions:', {
      canEdit,
      canEditLoading,
      canDelete,
      canDeleteLoading,
      hasEditPerm: stripes.hasPerm('ui-agreements.agreements.edit'),
      hasDeletePerm: stripes.hasPerm('ui-agreements.agreements.delete')
    });

    if (stripes.hasPerm('ui-agreements.agreements.edit')) {
      buttons.push(
        <Button
          key="clickable-dropdown-edit-agreement"
          buttonStyle="dropdownItem"
          disabled={canEditLoading || !canEdit}
          id="clickable-dropdown-edit-agreement"
          onClick={handlers.onEdit}
        >
          <Icon icon={canEditLoading ? 'spinner-ellipsis' : 'edit'}>
            <FormattedMessage id="ui-agreements.agreements.edit" />
          </Icon>
        </Button>
      );
    }

    if (stripes.hasPerm('ui-agreements.agreements.edit') && canEdit !== false) {
      buttons.push(
        <Button
          key="clickable-dropdown-duplicate-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-duplicate-agreement"
          onClick={() => {
            setShowDuplicateAgreementModal(true);
            onToggle();
          }}
        >
          <Icon icon="duplicate">
            <FormattedMessage id="ui-agreements.agreements.duplicate" />
          </Icon>
        </Button>
      );
    }

    if (stripes.hasPerm('ui-agreements.agreements.view')) {
      buttons.push(
        <Button
          key="clickable-dropdown-export-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-export-agreement"
          onClick={() => {
            handlers.onExportAgreement();
            onToggle();
          }}
        >
          <Icon icon="download">
            <FormattedMessage id="ui-agreements.agreements.export" />
          </Icon>
        </Button>
      );
    }

    if (stripes.hasPerm('ui-agreements.agreements.delete')) {
      buttons.push(
        <Button
          key="clickable-dropdown-delete-agreement"
          buttonStyle="dropdownItem"
          disabled={canDeleteLoading || !canDelete}
          id="clickable-dropdown-delete-agreement"
          onClick={() => {
            setShowDeleteConfirmationModal(true);
            onToggle();
          }}
        >
          <Icon icon={canEditLoading ? 'spinner-ellipsis' : 'trash'}>
            <FormattedMessage id="ui-agreements.delete" />
          </Icon>
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  };

  const getInitialAccordionsState = () => {
    return {
      allPeriods: false,
      controllingLicense: false,
      externalLicenses: false,
      futureLicenses: false,
      historicalLicenses: false,
      internalContacts: false,
      lines: false,
      notes: false,
      organizations: false,
      relatedAgreements: false,
      supplementaryDocs: false,
      terms: false,
      usageData: false,
      accessControl: false
    };
  };

  const renderEditAgreementPaneMenu = () => {
    const { agreement } = data;
    return stripes.hasPerm('ui-agreements.agreements.edit') ? (
      <PaneMenu>
        {handlers.onToggleTags &&
          <TagButton
            entity={agreement}
          />
        }
      </PaneMenu>
    ) : null;
  };

  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-agreement',
    onClose: handlers.onClose,
  };

  if (isLoading || canReadLoading) return <LoadingPane data-loading {...paneProps} />;

  if (!canRead) {
    return (
      <AccessControlErrorPane
        {...paneProps}
      />
    );
  }

  // istanbul ignore next
  const shortcuts = [
    {
      name: 'edit',
      handler: handlers.onEdit,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef)
    },
    {
      name: 'duplicateRecord',
      handler: () => {
        setShowDuplicateAgreementModal(true);
      }
    }
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <>
        <Pane
          actionMenu={getActionMenu}
          appIcon={<AppIcon app="agreements" />}
          lastMenu={renderEditAgreementPaneMenu()}
          paneTitle={data.agreement.name}
          {...paneProps}
        >
          <TitleManager record={data.agreement.name}>
            <Header {...getSectionProps()} />
            <Info {...getSectionProps('info')} />
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet initialStatus={getInitialAccordionsState()}>
                <AllPeriods {...getSectionProps('allPeriods')} />
                {data.policies?.length > 0 && <AccessControl policies={data.policies} />}
                {data.agreement?.contacts?.length > 0 && <InternalContacts {...getSectionProps('internalContacts')} />}
                <Lines {...getSectionProps('lines')} />
                {controllingLicenses?.length > 0 && <ControllingLicense {...getSectionProps('controllingLicense')} />}
                {futureLicenses?.length > 0 && <FutureLicenses {...getSectionProps('futureLicenses')} />}
                {historicalLicenses?.length > 0 && <HistoricalLicenses {...getSectionProps('historicalLicenses')} />}
                {data.agreement?.externalLicenseDocs?.length > 0 && <ExternalLicenses {...getSectionProps('externalLicenses')} />}
                {controllingLicenses?.length > 0 && <Terms {...getSectionProps('terms')} />}
                {data.agreement?.orgs?.length > 0 && <Organizations {...getSectionProps('organizations')} />}
                <CustomPropertiesView
                  contexts={contexts}
                  customProperties={data.agreement.customProperties}
                  customPropertiesEndpoint={CUSTPROP_ENDPOINT}
                  id="supplementaryProperties"
                />
                {data.agreement?.supplementaryDocs?.length > 0 && <SupplementaryDocs {...getSectionProps('supplementaryDocs')} />}
                {data.agreement?.usageDataProviders?.length > 0 && <UsageData {...getSectionProps('usageData')} />}
                {data.agreement?.relatedAgreements?.length > 0 && <RelatedAgreements {...getSectionProps('relatedAgreements')} />}
                <HandlerManager data={{ data }} event="ui-agreements-extension" stripes={stripes} />
                <NotesSmartAccordion
                  {...getSectionProps('notes')}
                  domainName="agreements"
                  entityId={data.agreement.id}
                  entityName={data.agreement.name}
                  entityType={AGREEMENT_ENTITY_TYPE}
                  pathToNoteCreate={urls.noteCreate()}
                  pathToNoteDetails={urls.notes()}
                />
              </AccordionSet>
            </AccordionStatus>
          </TitleManager>
        </Pane>
        <HelperComponent
          invalidateLinks={data.tagsInvalidateLinks}
          link={data.tagsLink}
        />
        {showDuplicateAgreementModal &&
          <DuplicateAgreementModal
            name={data.agreement.name}
            onClone={(obj) => handlers.onClone(obj)}
            onClose={() => setShowDuplicateAgreementModal(false)}
          />
        }
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-agreements.delete" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-agreements.agreements.deleteAgreement" />}
          id="delete-agreement-confirmation"
          message={<FormattedMessage id="ui-agreements.agreements.deleteConfirmMessage" values={{ name: data.agreement?.name }} />}
          onCancel={() => setShowDeleteConfirmationModal(false)}
          onConfirm={() => {
            handlers.onDelete();
            setShowDeleteConfirmationModal(false);
          }}
          open={showDeleteConfirmationModal}
        />
      </>
    </HasCommand>
  );
};

Agreement.propTypes = {
  components: PropTypes.shape({
    HelperComponent: PropTypes.elementType,
    TagButton: PropTypes.elementType,
  }),
  data: PropTypes.shape({
    agreement: PropTypes.shape({
      contacts: PropTypes.arrayOf(PropTypes.shape({})),
      customProperties: PropTypes.shape({}),
      description: PropTypes.string,
      externalLicenseDocs: PropTypes.arrayOf(PropTypes.shape({})),
      id: PropTypes.string,
      linkedLicenses: PropTypes.arrayOf(PropTypes.shape({})),
      lines: PropTypes.arrayOf(PropTypes.shape({})),
      name: PropTypes.string,
      orgs: PropTypes.arrayOf(PropTypes.shape({})),
      relatedAgreements: PropTypes.arrayOf(PropTypes.shape({})),
      supplementaryDocs: PropTypes.arrayOf(PropTypes.shape({})),
      usageDataProviders: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
    eresourcesFilterPath: PropTypes.string,
    policies: PropTypes.arrayOf(PropTypes.shape({})),
    searchString: PropTypes.string,
    tagsInvalidateLinks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    tagsLink: PropTypes.string,
  }).isRequired,
  handlers: PropTypes.shape({
    onClone: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onExportAgreement: PropTypes.func,
    onToggleTags: PropTypes.func,
  }).isRequired,
  helperApp: PropTypes.node,
  isLoading: PropTypes.bool.isRequired,
};

export default Agreement;
