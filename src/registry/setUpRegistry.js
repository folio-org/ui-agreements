import { Link } from 'react-router-dom';

import {
  InternalContactsArrayDisplay,
  OrganizationsArrayDisplay,
} from '@folio/stripes-erm-components';

import AgreementLookup from '../AgreementLookup';

import { GokbBasketButton, GokbTIPPTable } from './Gokb';
import RemoteResourceAgreementsList from './RemoteResourceAgreementsList';
import { ViewInLocalKbButton, ViewInRemoteKbButton } from './ViewActions';

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

  // RemoteKb resource
  const remoteKbResource = registry.registerResource('remoteKb');
  // GOKB TIPP
  remoteKbResource.setRenderFunction('gokbAddToBasketButton', ({ tipp }) => <GokbBasketButton tipp={tipp} />);
  remoteKbResource.setRenderFunction('gokbTippTable', ({ tipps }) => <GokbTIPPTable tipps={tipps} />);

  // Render RemoteKb Agreements List
  remoteKbResource.setRenderFunction('agreementsList', ({ remoteId, setBadgeCount }) => <RemoteResourceAgreementsList remoteId={remoteId} setBadgeCount={setBadgeCount} />);
  remoteKbResource.setRenderFunction('viewInLocalKbButton', ({ remoteId }) => <ViewInLocalKbButton remoteId={remoteId} />);
  remoteKbResource.setRenderFunction('viewInRemoteKbButton', ({ url, remoteKbName }) => <ViewInRemoteKbButton remoteKbName={remoteKbName} url={url} />);
};

export default setUpRegistry;
