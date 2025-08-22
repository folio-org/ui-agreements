import { Link } from 'react-router-dom';
import { InternalContactsArrayDisplay, OrganizationsArrayDisplay } from '@folio/stripes-erm-components';
import AgreementLookup from './AgreementLookup';

// Temporary ButtonComponent for GoKB packages
// const GoKBBasketButton = ({ pkg }) => {
//   // For now, just alert on click
//   return (
//     <button onClick={() => alert(`hi from registry: ${pkg.name || pkg.id}`)}>
//       Add to Basket: {pkg.name || pkg.id}
//     </button>
//   );
// };

const setUpRegistry = (registry) => {
  // Agreement Resource
  const agreementReg = registry.registerResource('agreement');

  agreementReg.setViewResources('/erm/agreements');
  agreementReg.setViewResource(agreement => `/erm/agreements/${agreement.id}`);

  agreementReg.setRenderFunction('internalContacts', record => {
    return <InternalContactsArrayDisplay contacts={record.contacts} />;
  });

  agreementReg.setRenderFunction('orgs', record => {
    return <OrganizationsArrayDisplay orgs={record.orgs} />;
  });

  // Lookup plugin
  agreementReg.setLookupComponent(AgreementLookup);

  // AgreementLine Resource
  const aglReg = registry.registerResource('entitlements');
  aglReg.setViewResources('/erm/agreementLines');
  aglReg.setViewResource(al => `/erm/agreementLines/${al.id}/agreement/${al.owner?.id}`);

  aglReg.setRenderFunction('parentAgreement', record => {
    return <Link to={`/erm/agreements/${record.owner.id}`}>{record.owner.name}</Link>;
  });

  // ErmPackage Resource
  const ermPkgReg = registry.registerResource('ermPackage');
  ermPkgReg.setViewResource(pkg => `/erm/packages/${pkg.id}`);

  const gokbPkgResource = registry.registerResource('gokbPackage');
  //at first make this button do the alert( 'hi from registery')
  // gokbPkgResource.setRenderFunction('addToBasketButton', res => {...render the button} />);
  gokbPkgResource.setRenderFunction(pkg => <GoKBBasketButton pkg={pkg} />);
};

export default setUpRegistry;
