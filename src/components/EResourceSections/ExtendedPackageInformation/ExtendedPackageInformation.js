import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Icon,
  KeyValue,
  MultiColumnList,
  Row
} from '@folio/stripes/components';

const ExtendedPackageInformation = ({
  eresource: { alternateResourceNames, description, identifiers, packageDescriptionUrls },
  id
}) => {
  const renderAlternativeNames = () => (
    <MultiColumnList
      columnMapping={{ name: <FormattedMessage id="ui-agreements.alternativeNames" /> }}
      contentData={alternateResourceNames}
      id="alternate-resource-names-list"
      visibleColumns={['name']}
    />
  );

  const renderIdentifiers = () => (
    <MultiColumnList
      columnMapping={{
        identifier: <FormattedMessage id="ui-agreements.packageIdentifiers.identifier" />,
        type: <FormattedMessage id="ui-agreements.packageIdentifiers.type" />
      }}
      contentData={identifiers}
      formatter={{
        identifier: item => (item.identifier.value),
        type: item => (item.identifier.ns.value)
      }}
      id="identifiers-list"
      visibleColumns={['type', 'identifier']}
    />
  );

  const renderPackageDescriptionUrls = () => (
    <MultiColumnList
      columnMapping={{ url: <FormattedMessage id="ui-agreements.eresources.packageDescriptionUrls" /> }}
      contentData={packageDescriptionUrls}
      formatter={{
        url: item => (
          <a
            href={item.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon icon="external-link" iconPosition="end">{item.url}</Icon>
          </a>
        ),
      }}
      id="package-description-urls-list"
      visibleColumns={['url']}
    />
  );

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-agreements.eresources.extendedPackageInformation" />}
    >
      {description &&
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-agreements.eresources.description" />}
              value={description}
            />
          </Col>
        </Row>
      }
      {packageDescriptionUrls?.length > 0 &&
        <Row>
          <Col xs={12}>
            {renderPackageDescriptionUrls()}
          </Col>
        </Row>
      }
      {alternateResourceNames?.length > 0 &&
        <Row>
          <Col xs={12}>
            {renderAlternativeNames()}
          </Col>
        </Row>
      }
      {identifiers?.length > 0 &&
        <Row>
          <Col xs={12}>
            {renderIdentifiers()}
          </Col>
        </Row>
      }
    </Accordion>
  );
};

ExtendedPackageInformation.propTypes = {
  eresource: PropTypes.shape({
    alternateResourceNames: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })),
    availabilityScope: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string
    }),
    contentTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      contentType: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      }),
    })),
    description: PropTypes.string,
    id: PropTypes.string,
    identifiers: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.shape({
        value: PropTypes.string,
        ns: PropTypes.shape({
          value: PropTypes.string
        })
      }).isRequired
    })),
    lifecycleStatus: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string
    }),
    name: PropTypes.string,
    packageDescriptionUrls: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string
    })),
    reference: PropTypes.string,
    source: PropTypes.string,
    sourceDataCreated: PropTypes.string,
    sourceDataUpdated: PropTypes.string,
    vendor: PropTypes.shape({
      name: PropTypes.string,
    })
  }),
  id: PropTypes.string
};

export default ExtendedPackageInformation;

