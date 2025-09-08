import { Link } from 'react-router-dom';

import {
  InternalContactsArrayDisplay,
  OrganizationsArrayDisplay,
} from '@folio/stripes-erm-components';

import AgreementLookup from '../AgreementLookup';

import { GokbBasketButton, GokbTIPPTable } from './GokbTIPP';

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

  // GOKB TIPP resource
  const gokbTIPPResource = registry.registerResource('gokbTIPP');
  gokbTIPPResource.setRenderFunction('addToBasketButton', tipp => <GokbBasketButton tipp={tipp} />);
  gokbTIPPResource.setRenderFunction('gokbTIPPTable', tipps => <GokbTIPPTable tipps={tipps} />);
};

export default setUpRegistry;
