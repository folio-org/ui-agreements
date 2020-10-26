import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Headline,
  Icon,
  KeyValue,
  LoadingPane,
  NoValue,
  Pane,
  Row
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';

export default class Platform extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      platform: PropTypes.object.isRequired,
      searchString: PropTypes.string,
    }).isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
  }

  getActionMenu = () => (
    <>
      <IfPermission perm="ui-agreements.platforms.edit">
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-edit-platform"
          onClick={this.props.handlers.onEdit}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-agreements.platform.edit" />
          </Icon>
        </Button>
      </IfPermission>
    </>
  )

  render() {
    const {
      data: { platform },
      isLoading,
      handlers,
    } = this.props;

    const paneProps = {
      defaultWidth: '55%',
      dismissible: true,
      id: 'pane-view-platform',
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane data-loading {...paneProps} />;

    return (
      <>
        <Pane
          actionMenu={this.getActionMenu}
          appIcon={<AppIcon app="agreements" iconKey="platform" />}
          paneTitle={platform?.name}
          {...paneProps}
        >
          <TitleManager record={platform?.name}>
            <Row>
              <Col xs={12}>
                <div data-test-platform-name>
                  <Headline
                    size="xx-large"
                    tag="h2"
                  >
                    {platform?.name}
                  </Headline>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <KeyValue label={<FormattedMessage id="ui-agreements.platform.localPlatformCode" />}>
                  <div data-test-local-platform-code>
                    {platform?.localCode ?? <NoValue />}
                  </div>
                </KeyValue>
              </Col>
              <Col xs={3}>
                <KeyValue label={<FormattedMessage id="ui-agreements.platform.locators" />}>
                  <div data-test-platform-locators>
                    {platform?.locators?.length ?
                      platform?.locators.map(locator => <div>{locator?.domainName}</div>)
                      :
                      <NoValue />
                    }
                  </div>
                </KeyValue>
              </Col>
            </Row>
          </TitleManager>
        </Pane>
      </>
    );
  }
}
