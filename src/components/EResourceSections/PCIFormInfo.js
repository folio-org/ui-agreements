import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';


import {
  Checkbox,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';
import { parseDateOnlyString } from '../utilities';
import IfSuppressFromDiscoveryEnabled from '../IfSuppressFromDiscoveryEnabled';

export default class PCIFormInfo extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
  }

  render() {
    const { settings } = this.props;
    return (
      <div data-test-edit-pci-info>
        <Field
          autoFocus
          component={TextField}
          data-test-pci-name
          disabled
          id="edit-pci-name"
          label={<FormattedMessage id="ui-agreements.eresources.name" />}
          maxLength={255}
          name="name"
          required
        />
        <Row>
          <Col xs={3}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              disabled
              id="pci-access-from"
              label={<FormattedMessage id="ui-agreements.eresources.accessibleFrom" />}
              name="accessStart"
              parser={parseDateOnlyString}
            />
          </Col>
          <Col xs={3}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              disabled
              id="pci-access-end"
              label={<FormattedMessage id="ui-agreements.eresources.accessibleUntil" />}
              name="accessEnd"
              parser={parseDateOnlyString}
            />
          </Col>
          <IfSuppressFromDiscoveryEnabled
            settings={settings}
            sfdLocation="pci"
          >
            <Col xs={3}>
              <Field
                component={Checkbox}
                id="pci-suppress-from-discovery"
                label={<FormattedMessage id="ui-agreements.eresources.suppressFromDiscovery" />}
                name="suppressFromDiscovery"
                type="checkbox"
                vertical
              />
            </Col>
          </IfSuppressFromDiscoveryEnabled>
        </Row>
      </div>
    );
  }
}
