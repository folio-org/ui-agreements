import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Col,
} from '@folio/stripes/components';

const TitleFormInfo = ({
  isSuppressFromDiscoveryEnabled,
  name,
}) => (
  <div data-test-platform-form-info>
    <div data-test-title-instance-name>
      {name}
    </div>
    { isSuppressFromDiscoveryEnabled('title') ?
      <Col xs={3}>
        <Field
          component={Checkbox}
          id="title-suppress-from-discovery"
          label={<FormattedMessage id="ui-agreements.eresources.suppressFromDiscovery" />}
          name="suppressFromDiscovery"
          type="checkbox"
          vertical
        />
      </Col> : null
            }
  </div>
);


TitleFormInfo.propTypes = {
  isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
  name: PropTypes.string,
};

export default TitleFormInfo;
