import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { LicenseTermsList } from '@folio/stripes-erm-components';

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
    data: PropTypes.shape({
      terms: PropTypes.array,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  renderTermsList = (controllingLicense) => {
    const license = controllingLicense.remoteId_object;

    return (
      <LicenseTermsList
        license={license}
        terms={this.props.data.terms}
      />
    );
  }

  render() {
    const {
      agreement: { linkedLicenses = [] },
      id,
      onToggle,
      open,
    } = this.props;

    const controllingLicense = linkedLicenses.find(l => l.status.value === 'controlling');

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.licenseAndBusTerms" />}
        open={open}
        onToggle={onToggle}
      >
        { controllingLicense ?
          this.renderTermsList(controllingLicense) :
          <FormattedMessage id="ui-agreements.license.noControllingLicense" />
        }
      </Accordion>
    );
  }
}
