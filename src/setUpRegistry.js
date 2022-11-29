import { InternalContactsArrayDisplay, OrganizationsArrayDisplay } from '@folio/stripes-erm-components';
import AgreementLookup from './AgreementLookup';

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
  const aglReg = registry.registerResource('agreementLine');
  aglReg.setViewResources(al => `/erm/agreementLines/${al.id}`);
  aglReg.setViewResource(al => `/erm/agreements/${al.owner?.id}/line/${al.id}`);

  // ErmPackage Resource
  const ermPkgReg = registry.registerResource('ermPackage');
  ermPkgReg.setViewResource(pkg => `/erm/packages/${pkg.id}`);
};

export default setUpRegistry;
