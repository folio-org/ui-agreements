import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Field } from 'react-final-form';
import { useStripes } from '@folio/stripes/core';

import {
  Checkbox,
  Layout
} from '@folio/stripes/components';

const SuppressFromDiscoveryFields = ({ name }) => {
  const stripes = useStripes();
  const disabled = !stripes.hasPerm('ui-agreements.generalSettings.manage');
  return (
    <>
      <Layout className="padding-bottom-gutter padding-top-gutter" data-test-sfdfa-description>
        <strong>
          <FormattedMessage id="ui-agreements.settings.general.displaySuppressFromDiscovery.description" />
        </strong>
      </Layout>
      <Field
        component={Checkbox}
        data-test-sfdfa-agreement-line
        disabled={disabled}
        id="displaySuppressFromDiscoveryAgreementLine"
        label={<FormattedMessage id="ui-agreements.settings.general.displaySuppressFromDiscoveryAgreementLine.title" />}
        name={`${name}.agreementLine`}
        type="checkbox"
      />
      <Field
        component={Checkbox}
        data-test-sfdfa-pci
        disabled={disabled}
        id="displaySuppressFromDiscoveryPCI"
        label={<FormattedMessage id="ui-agreements.settings.general.displaySuppressFromDiscovery.titlesInPackages" />}
        name={`${name}.pci`}
        type="checkbox"
      />
      <Field
        component={Checkbox}
        data-test-sfdfa-title
        disabled={disabled}
        id="displaySuppressFromDiscoveryTitle"
        label={<FormattedMessage id="ui-agreements.settings.general.displaySuppressFromDiscovery.titles" />}
        name={`${name}.title`}
        type="checkbox"
      />
    </>
  );
};

SuppressFromDiscoveryFields.propTypes = {
  name: PropTypes.string
};

export default SuppressFromDiscoveryFields;

