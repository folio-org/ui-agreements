import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { LicenseTermsList } from '@folio/stripes-erm-components';

export default class LicenseBusinessTerms extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      linkedLicenses: PropTypes.arrayOf(PropTypes.shape({
        remoteId_object: PropTypes.object.isRequired,
        status: PropTypes.shape({
          value: PropTypes.string,
        }).isRequired,
      })),
      parentResources: PropTypes.shape({
        terms: PropTypes.object
      }),
      id: PropTypes.string,
      onToggle: PropTypes.func,
      open: PropTypes.bool,
    })
  }

 renderLicenseTermsList = (agreement, controllingLicense) => {
   const license = controllingLicense.remoteId_object;
   const terms = get(agreement.parentResources.terms, ['records'], []);
   return (
     <LicenseTermsList
       license={license}
       terms={terms}
     />
   );
 }

 render() {
   const agreement = this.props;
   const licenses = get(agreement, ['agreement', 'linkedLicenses'], []);
   const controllingLicense = licenses.find(l => l.status.value === 'controlling');

   return (
     <Accordion
       id={agreement.id}
       label={<FormattedMessage id="ui-agreements.agreements.licenseAndBusTerms" />}
       open={agreement.open}
       onToggle={agreement.onToggle}
     >
       { controllingLicense ?
         this.renderLicenseTermsList(agreement, controllingLicense) :
         <FormattedMessage id="ui-agreements.license.noControllingLicense" />
       }
     </Accordion>
   );
 }
}
