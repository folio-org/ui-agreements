import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { checkScope } from '@folio/stripes-erm-components';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  HasCommand,
  Icon,
  LoadingPane,
  Row,
  Pane,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import { PlatformInfo, PlatformUrlCustomization, PlatformProxySettings } from '../PlatformSections';

const Platform = ({
  data: { platform, stringTemplates, proxyServers },
  isLoading,
  handlers
}) => {
  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-platform',
    onClose: handlers.onClose,
  };

  const accordionStatusRef = useRef(null);

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

  const getSectionProps = (id) => {
    return {
      id,
      platform,
      handlers,
      stringTemplates,
      proxyServers
    };
  };

  const getInitialAccordionsState = () => {
    return {
      platformUrlCustomization: false,
      platformProxySettings: false
    };
  };

  const shortcuts = [
    {
      name: 'edit',
      handler: handlers.onEdit,
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <>
        <Pane
          actionMenu={() => (
            <>
              <IfPermission perm="ui-agreements.platforms.edit">
                <Button
                  buttonStyle="dropdownItem"
                  id="clickable-dropdown-edit-platform"
                  onClick={handlers.onEdit}
                >
                  <Icon icon="edit">
                    <FormattedMessage id="ui-agreements.platform.edit" />
                  </Icon>
                </Button>
              </IfPermission>
            </>
          )}
          appIcon={<AppIcon app="agreements" iconKey="platform" />}
          paneTitle={platform?.name}
          {...paneProps}
        >
          <TitleManager record={platform?.name}>
            <PlatformInfo {...getSectionProps('platformInfo')} />
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet initialStatus={getInitialAccordionsState()}>
                <PlatformUrlCustomization {...getSectionProps('platformUrlCustomization')} />
                <PlatformProxySettings {...getSectionProps('platformProxySettings')} />
              </AccordionSet>
            </AccordionStatus>
          </TitleManager>
        </Pane>
      </>
    </HasCommand>
  );
};

Platform.propTypes = {
  data: PropTypes.shape({
    platform: PropTypes.object.isRequired,
    stringTemplates: PropTypes.arrayOf(PropTypes.object),
    searchString: PropTypes.string,
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Platform;
