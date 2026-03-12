import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { CustomPropertyCard, useCustProps } from '@k-int/stripes-kint-components';

import { useHasLicensesInterface } from '../../../hooks';
import { LICENSE_CUSTPROP_ENDPOINT } from '../../../constants';

const Terms = ({ agreement, id }) => {
  const { hasLicensesInterface } = useHasLicensesInterface();
  const { linkedLicenses = [] } = agreement || {};

  const { custprops: terms = [] } = useCustProps({
    endpoint: LICENSE_CUSTPROP_ENDPOINT,
    options: {
      sort: [
        { path: 'retired' },
        { path: 'primary', direction: 'desc' },
        { path: 'label' }
      ]
    },
    queryParams: {
      enabled: linkedLicenses?.length > 0 && hasLicensesInterface
    }
  });

  const controllingLicense = linkedLicenses.find(l => l.status.value === 'controlling');

  const renderTermsList = (license) => {
    const customProperties = license.remoteId_object?.customProperties || [];

    return (
      <div>
        {terms.map((term, index) => (
          <CustomPropertyCard
            key={`custom-property-card[${index}]`}
            ctx={term.ctx}
            customProperty={customProperties?.[term.name]?.[0]}
            customPropertyDefinition={term}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-agreements.agreements.licenseAndBusTerms" />}
    >
      {controllingLicense ?
        renderTermsList(controllingLicense) :
        <FormattedMessage id="ui-agreements.emptyAccordion.licenseAndBusinessTerms" />
      }
    </Accordion>
  );
};

Terms.propTypes = {
  agreement: PropTypes.shape({
    linkedLicenses: PropTypes.arrayOf(PropTypes.shape({
      remoteId_object: PropTypes.object.isRequired,
      status: PropTypes.shape({
        value: PropTypes.string,
      }).isRequired,
    })),
  }),
  id: PropTypes.string,
};

export default Terms;
