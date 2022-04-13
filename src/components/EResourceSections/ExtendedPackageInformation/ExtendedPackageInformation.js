import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row
} from '@folio/stripes/components';

const ExtendedPackageInformation = ({
  eresource: { alternateResourceNames, description, packageDescriptionUrls },
  id
}) => {
  // const renderAlternativeNames
  return (
    <Accordion
      id={id}
      label="Extended package information"
    >
      <Row>
        <Col xs={12}>
          {/* <Headline>
              <FormattedMessage id="ui-agreements.eresources.description" />
            </Headline> */}
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.description" />}
            value={description ?? <NoValue />}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div>
            <Headline>
              <FormattedMessage id="ui-agreements.eresources.packageDescriptionUrls" />
            </Headline>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div>
            <Headline>
              <FormattedMessage id="ui-agreements.alternativeNames" />
            </Headline>
          </div>
        </Col>
      </Row>
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
      contentType: PropTypes.string
    })),
    description: PropTypes.string,
    id: PropTypes.string,
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

