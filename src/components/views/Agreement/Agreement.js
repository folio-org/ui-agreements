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

import { useAgreementsContexts, useChunkedOrderLines } from '../../../hooks';

import { urls } from '../../utilities';
import {
  AGREEMENT_ENTITY_TYPE,
  CUSTPROP_ENDPOINT,
  LICENSE_CUSTPROP_ENDPOINT,
  statuses
} from '../../../constants';

const Agreement = ({
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
      enabled: licenses?.length > 0
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

    if (stripes.hasPerm('ui-agreements.agreements.edit')) {
      buttons.push(
        <Button
          key="clickable-dropdown-edit-agreement"
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-agreement"
          onClick={handlers.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-agreements.agreements.edit" />
          </Icon>
        </Button>
      );
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
          id="clickable-dropdown-delete-agreement"
          onClick={() => {
            setShowDeleteConfirmationModal(true);
            onToggle();
          }}
        >
          <Icon icon="trash">
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

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

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
          onToggle={handlers.onToggleTags}
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
  components: PropTypes.object,
  data: PropTypes.shape({
    agreement: PropTypes.object.isRequired,
    eresourcesFilterPath: PropTypes.string,
    searchString: PropTypes.string,
    tagsLink: PropTypes.string,
    tagsInvalidateLinks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
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
