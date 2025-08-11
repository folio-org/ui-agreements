import { createRef } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppIcon, useStripes } from '@folio/stripes/core';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  collapseAllSections,
  Col,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  MetaSection,
  Pane,
  Row,
  LoadingPane,
  PaneMenu,
} from '@folio/stripes/components';

// import {
//   CorrespondingAuthor,
//   Funding,
//   Publication,
//   PublicationStatus,
//   RequestContact,
//   RequestInfo,
//   Correspondence,
//   Agreement,
//   Charges,
// } from '../../PublicationRequestSections';

// import urls from '../../../util/urls';
// import useOAHelperApp from '../../../hooks/useOAHelperApp';
// import { PANE_DEFAULT_WIDTH } from '../../../constants/config';
// import { PUBLICATION_REQUEST_ENDPOINT } from '../../../constants/endpoints';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  resource: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({}))
  ]),
  queryProps: PropTypes.shape({
    isLoading: PropTypes.bool,
  }),
};

const RemoteKbResource = ({
  // records: request,
  // resource: records = [],
  resource,
  onClose,
  queryProps: { isLoading },
}) => {
  // if resource is an array let title be the first element
  // const title = (Array.isArray(resource) && resource.length > 0) ? resource[0] : resource;
  console.log('RemoteKbResource resource', resource);
  // console.log('RemoteKbResource records', records);
  // console.log('RemoteKbResource', records[0]);
  // const title = resource?.records;
  // console.log('RemoteKbResource title', title);
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const accordionStatusRef = createRef();
  // const { HelperComponent, ChecklistButton, isOpen } = useOAHelperApp();
  const stripes = useStripes();

  // const handleEdit = () => {
  //   history.push(`${urls.publicationRequestEdit(params?.id)}${location.search}`);
  // };

  const getSectionProps = (name) => {
    return {
      id: `remote-kb-title-section-${name}`,
      resource,
    };
  };

  const shortcuts = [
    // { name: 'edit', handler: () => handleEdit() },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  const renderActionMenu = () => {
    const buttons = [];
    // if (stripes.hasPerm('ui-oa.publicationRequest.edit')) {
    //   buttons.push(
    //     <Button
    //       buttonStyle="dropdownItem"
    //       id="clickable-dropdown-edit-remote-kb-title"
    //       onClick={handleEdit}
    //     >
    //       <Icon icon="edit">
    //         <FormattedMessage id="ui-oa.publicationRequest.edit" />
    //       </Icon>
    //     </Button>
    //   );
    // }
    return buttons.length ? buttons : null;
  };

  if (isLoading) {
    return (
      <LoadingPane
        // defaultWidth={PANE_DEFAULT_WIDTH}
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        actionMenu={renderActionMenu}
        appIcon={<AppIcon app="oa" iconKey="app" size="small" />}
        // defaultWidth={PANE_DEFAULT_WIDTH}
        dismissible
        lastMenu={
          <PaneMenu>
            {/* <ChecklistButton /> */}
          </PaneMenu>
        }
        onClose={onClose}
        paneSub={resource?.publicationTitle}
        paneTitle={
          <FormattedMessage
            id="ui-oa.publicationRequest.titleTitle"
            values={{ number: resource?.titleNumber }}
          />
        }
      >
        <MetaSection
          contentId="publicationRequestMetaContent"
          createdDate={resource?.dateCreated}
          hideSource
          lastUpdatedDate={resource?.lastUpdated}
        />

        {/* <RequestInfo {...getSectionProps('info')} /> */}
        <AccordionStatus ref={accordionStatusRef}>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            {/* {request?.correspondingAuthor?.id && (
              <CorrespondingAuthor
                {...getSectionProps('correspondingAuthor')}
              />
            )}
            {request?.requestContact?.id && (
              <RequestContact {...getSectionProps('requestContact')} />
            )}
            <Publication {...getSectionProps('publication')} />
            <PublicationStatus {...getSectionProps('publicationStatus')} />
            {request?.fundings && <Funding {...getSectionProps('funding')} />}

            {(request?.agreement || request?.withoutAgreement) && (
              <Agreement {...getSectionProps('agreement')} />
            )}
            <Correspondence {...getSectionProps('correspondences')} />
            <Charges {...getSectionProps('charges')} /> */}
          </AccordionSet>
        </AccordionStatus>
      </Pane>
      {/* <HelperComponent
        isOpen={isOpen}
        ownerId={request?.id}
        resourceEndpoint={PUBLICATION_REQUEST_ENDPOINT}
      /> */}
    </HasCommand>
  );
};

RemoteKbResource.propTypes = propTypes;

export default RemoteKbResource;
