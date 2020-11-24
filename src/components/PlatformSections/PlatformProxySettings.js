import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Col,
  Headline,
  KeyValue,
  Row,
  NoValue,
  Tooltip,
  MultiColumnList
} from '@folio/stripes/components';
import { urls } from '../utilities';

const PlatformProxySettings = ({ platform, proxyServers = [], id, handlers: { onViewUrlCustomiser, onClickProxyServerAction } }) => {
  const columnMapping = {
    name: <FormattedMessage id="ui-agreements.platform.platformProxySettings.name" />,
    status: <FormattedMessage id="ui-agreements.platform.platformProxySettings.status" />,
    actions: <FormattedMessage id="ui-agreements.platform.platformProxySettings.actions" />,
  };

  const columnWidths = {
    name: 250,
    status: 250
  };

  const formatter = {
    name: ({ name }) => name,
    status: ({ idScopes }) => (idScopes.includes(platform.id) ?
      <FormattedMessage id="ui-agreements.platform.platformProxySettings.notUsed" /> :
      <FormattedMessage id="ui-agreements.platform.platformProxySettings.used" />),
    actions: (proxyServerSetting) => {
      const { name, idScopes } = proxyServerSetting;
      const hasPlatformId = idScopes.includes(platform.id);
      return (
        <Tooltip
          id="proxy-server-action-button-tooltip"
          placement="top"
          text={hasPlatformId ?
            <FormattedMessage id="ui-agreements.platform.platformProxySettings.useProxyTooltip" values={{ proxyName : name, platformName: platform.name }} /> :
            <FormattedMessage id="ui-agreements.platform.platformProxySettings.doNotUseProxyTooltip" values={{ proxyName : name, platformName: platform.name }} />
          }
        >
          {({ ref, ariaIds }) => (
            <div
              ref={ref}
              aria-labelledby={ariaIds.text}
            >
              <Button
                buttonStyle={hasPlatformId ? 'primary' : 'default'}
                marginBottom0
                onClick={() => onClickProxyServerAction(proxyServerSetting, platform.id, hasPlatformId)}
              >
                {(hasPlatformId ?
                  <FormattedMessage id="ui-agreements.platform.platformProxySettings.useThisProxy" /> :
                  <FormattedMessage id="ui-agreements.platform.platformProxySettings.doNotUseThisProxy" />
                )}
              </Button>
            </div>
          )}
        </Tooltip>
      );
    },
  };

  const visibleColumns = [
    'name',
    'status',
    'actions'
  ];

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-agreements.platform.platformProxyServerSettings" />}
    >
      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={proxyServers}
        formatter={formatter}
        id="url-customization"
        interactive={false}
        isEmptyMessage={<FormattedMessage id="ui-agreements.platform.noplatformProxyServer" />}
        visibleColumns={visibleColumns}
      />
    </Accordion>
  );
};

PlatformProxySettings.propTypes = {
  platform: PropTypes.shape({
    localCode: PropTypes.string,
    locators: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string
  }).isRequired,
};

export default PlatformProxySettings;
