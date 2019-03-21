import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { LicenseTermsList } from '@folio/stripes-erm-components';

export default class LicenseBusinessTerms extends React.Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      terms: PropTypes.object,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

 renderLicenseTermsList = (controllingLicense) => {
   const license = controllingLicense.remoteId_object;
   const terms = get(this.props.parentResources.terms, ['records'], []);
   return (
     <LicenseTermsList
       license={license}
       terms={terms}
     />
   );
 }

 render() {
   const licenses = get(this.props, ['agreement', 'linkedLicenses'], []);
   const controllingLicense = licenses.find(l => l.status.value === 'controlling');

   return (
     <Accordion
       id={this.props.id}
       label={<FormattedMessage id="ui-agreements.agreements.licenseAndBusTerms" />}
       open={this.props.open}
       onToggle={this.props.onToggle}
     >
       { controllingLicense ?
         this.renderLicenseTermsList(controllingLicense) :
         <FormattedMessage id="ui-agreements.license.noControllingLicense" />
         }
     </Accordion>
   );
 }
}
