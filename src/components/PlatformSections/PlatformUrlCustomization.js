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
  MultiColumnList
} from '@folio/stripes/components';
import { urls } from '../utilities';

const PlatformUrlCustomization = ({ platform, stringTemplates = [], id, handlers: { onViewUrlCustomiser } }) => {
  const urlCustomiserStringTemplates = stringTemplates?.urlCustomisers ?? [];

  const renderAddUrlCustomizationButton = () => {
    return (
      <IfPermission perm="ui-agreements.platforms.edit">
        <Button
          disabled={urlCustomiserStringTemplates?.length > 0}
          id="add-url-customization-button"
          to={urls.urlCustomizerCreate(platform.id)}
        >
          <FormattedMessage id="ui-agreements.platform.addUrlCustomization" />
        </Button>
      </IfPermission>
    );
  };

  const columnMapping = {
    name: <FormattedMessage id="ui-agreements.platform.urlCustomization.name" />,
    customizationCode: <FormattedMessage id="ui-agreements.platform.urlCustomization.customizationCode" />,
  };

  const columnWidths = {
    name: 250,
  };

  const formatter = {
    name: ({ name }) => name,
    customizationCode: ({ rule }) => rule
  };

  const visibleColumns = [
    'name',
    'customizationCode'
  ];

  return (
    <Accordion
      displayWhenOpen={renderAddUrlCustomizationButton()}
      id={id}
      label={<FormattedMessage id="ui-agreements.platform.urlCustomization" />}
    >
      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={urlCustomiserStringTemplates}
        formatter={formatter}
        id="url-customization"
        isEmptyMessage={<FormattedMessage id="ui-agreements.platform.noUrlCustomization" />}
        onRowClick={(e, row) => {
          if (e.target.tagName !== 'A') {
            onViewUrlCustomiser(row.id);
          }
        }}
        visibleColumns={visibleColumns}
      />
    </Accordion>
  );
};

PlatformUrlCustomization.propTypes = {
  platform: PropTypes.shape({
    localCode: PropTypes.string,
    locators: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string
  }).isRequired,
};

export default PlatformUrlCustomization;
