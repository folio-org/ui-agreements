import React from 'react';
import { upperFirst } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Field } from 'react-final-form';
import { useStripes } from '@folio/stripes/core';

import {
  Checkbox,
  Layout
} from '@folio/stripes/components';

import { hiddenAccordions } from '../../../constants';

const hiddenAccordionsNames = Object.keys(hiddenAccordions);

const HideAccordions = ({ name }) => {
  const stripes = useStripes();
  const disabled = !stripes.hasPerm('ui-agreements.generalSettings.manage');

  return (
    <>
      <Layout className="padding-bottom-gutter padding-top-gutter" data-test-hide-accordions-description>
        <strong>
          <FormattedMessage id="ui-agreements.settings.general.hideAccordions.description" />
        </strong>
      </Layout>
      {hiddenAccordionsNames.map((accordion, index) => {
        const upperAccordion = upperFirst(accordion);
        const toLower = accordion.toLowerCase();
        return (
          <div key={index}>
            <Field
              component={Checkbox}
              data-testid={`hide-accordions-${toLower}`}
              disabled={disabled}
              id={`hideAccordions${upperAccordion}`}
              label={<FormattedMessage id={`ui-agreements.settings.general.hideAccordions.${accordion}`} />}
              name={`${name}.${accordion}`}
              type="checkbox"
            />
          </div>
        );
      })
      }
    </>
  );
};

HideAccordions.propTypes = {
  name: PropTypes.string
};

export default HideAccordions;

