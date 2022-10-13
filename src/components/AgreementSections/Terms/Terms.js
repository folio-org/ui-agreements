import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { CustomPropertyCard } from '@k-int/stripes-kint-components';

export default class Terms extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      linkedLicenses: PropTypes.arrayOf(PropTypes.shape({
        remoteId_object: PropTypes.object.isRequired,
        status: PropTypes.shape({
          value: PropTypes.string,
        }).isRequired,
      })),
    }),
    id: PropTypes.string,
    terms: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    terms: [],
  }

  renderTermsList = (controllingLicense) => {
    const customProperties = controllingLicense.remoteId_object?.customProperties || [];
    const terms = this.props.terms;
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
  }

  render() {
    const {
      agreement: { linkedLicenses = [] },
      id,
    } = this.props;

    const controllingLicense = linkedLicenses.find(l => l.status.value === 'controlling');

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseAndBusTerms" />}
      >
        {controllingLicense ?
          this.renderTermsList(controllingLicense) :
          <FormattedMessage id="ui-agreements.emptyAccordion.licenseAndBusinessTerms" />
        }
      </Accordion>
    );
  }
}
