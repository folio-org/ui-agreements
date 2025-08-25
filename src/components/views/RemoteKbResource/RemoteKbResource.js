import { createRef } from 'react';
import PropTypes from 'prop-types';
import { JSONPath } from 'jsonpath-plus';
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
  LoadingPane,
  MetaSection,
  Pane,
  Row,
  PaneMenu,
} from '@folio/stripes/components';

const PANE_DEFAULT_WIDTH = '50%';

const propTypes = {
  config: PropTypes.shape({}).isRequired,
  kbKey: PropTypes.string.isRequired,
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
  config,
  kbKey,
  resource,
  onClose,
  queryProps: { isLoading },
}) => {
  const displayConfig = config.configuration.view.display;
  console.log('displayConfig', displayConfig);
  console.log('RemoteKbResource resource', resource);
  const accordionStatusRef = createRef();

  const applyJsonPath = (expression) => JSONPath({ path: expression, json: resource }) || [];

  const paneTitle = applyJsonPath(displayConfig.title?.expression, resource);

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
        defaultWidth={PANE_DEFAULT_WIDTH}
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
        appIcon={<AppIcon app="agreements" iconKey={displayConfig.icon} size="small" />}
        defaultWidth={PANE_DEFAULT_WIDTH}
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
      >
        <MetaSection
          contentId="remoteKbResourceMetaContent"
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
    </HasCommand>
  );
};

RemoteKbResource.propTypes = propTypes;

export default RemoteKbResource;
