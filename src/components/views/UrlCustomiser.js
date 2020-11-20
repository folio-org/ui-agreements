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
  Headline,
  Icon,
  KeyValue,
  LoadingPane,
  NoValue,
  Row,
  Pane,
} from '@folio/stripes/components';
import { IfPermission, TitleManager } from '@folio/stripes/core';

const UrlCustomiser = ({
  data: { urlCustomisation },
  isLoading,
  handlers
}) => {
  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-urlcustomiser',
    onClose: handlers.onClose,
  };

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

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
                <Button
                  buttonStyle="dropdownItem"
                  id="clickable-dropdown-edit-platform"
                  onClick={handlers.onDelete}
                >
                  <Icon icon="delete">
                    <FormattedMessage id="ui-agreements.platform.delete" />
                  </Icon>
                </Button>
              </IfPermission>
            </>
          )}
          paneTitle={urlCustomisation?.name}
          {...paneProps}
        >
          <TitleManager record={urlCustomisation?.name}>
            <Row>
              <Col xs={12}>
                <div data-test-platform-name>
                  <Headline
                    size="xx-large"
                    tag="h2"
                  >
                    {urlCustomisation?.name}
                  </Headline>
                </div>
              </Col>
            </Row>
            <KeyValue label={<FormattedMessage id="ui-agreements.platform.urlCustomization.customizationCode" />}>
              <div data-test-url-customization-code>
                {urlCustomisation?.rule ?? <NoValue />}
              </div>
            </KeyValue>
          </TitleManager>
        </Pane>
      </>
    </HasCommand>
  );
};

UrlCustomiser.propTypes = {
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

export default UrlCustomiser;
