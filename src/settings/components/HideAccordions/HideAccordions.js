import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Field } from 'react-final-form';

import {
  Checkbox,
  Layout
} from '@folio/stripes/components';

const HideAccordions = ({ name }) => {
  return (
    <>
      <Layout className="padding-bottom-gutter padding-top-gutter" data-test-hide-accordions-description>
        <strong>
          <FormattedMessage id="ui-agreements.settings.hideAccordions.description" />
        </strong>
      </Layout>
      <Field
        component={Checkbox}
        data-test-hide-accordions-usagedata
        id="hideAccordionsUsageData"
        label={<FormattedMessage id="ui-agreements.settings.hideAccordions.usageData" />}
        name={`${name}.usageData`}
        type="checkbox"
      />
    </>
  );
};

HideAccordions.propTypes = {
  name: PropTypes.string
};

export default HideAccordions;

