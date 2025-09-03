import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  InternalContactsArrayDisplay,
  OrganizationsArrayDisplay,
  TitleOnPlatformLink
} from '@folio/stripes-erm-components';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import AgreementLookup from './AgreementLookup';
import { useBasket, usePackages } from './hooks';

import IconDropdown from './components/IconDropdown';
import { buildPackageEntitlementOption } from './components/utilities';
import { MultiColumnList } from '@folio/stripes/components';
import Coverage from './components/Coverage';
import { PCICoverage } from './components/EResourceSections';
// This should probably eventually come from kint comps

// Temporary button component for adding GoKB title/package to basket FROM a TIPP resource
const GoKbBasketButton = ({ tipp }) => {
  // FIXME For PACKAGE level we need to fetch the internal package and either add it as is or not give the option
  const { addToBasket, existsInBasket, removeFromBasket } = useBasket();

  // We have to fetch the internal package for the GOKB package, and the internal PCIs for the GOKB TIPPs
  const packagesQueryParams = generateKiwtQueryParams({
    filters: [{
      value: `(identifiers.identifier.ns.value==gokb_uuid&&identifiers.identifier.value==${tipp.tippPackageUuid})`
    }],
    stats: false
  }, {});
  const { packages = [], isLoading } = usePackages({
    queryParams: packagesQueryParams
  });
  console.log("TIPP: %o", tipp);
  console.log("PACKAGES: %o", packages);

  const tippBasketItem = {
    id: tipp.uuid || tipp.id,
    name: tipp.name,
    type: 'GoKBTitle',
  };
  const tippInBasket = existsInBasket(tippBasketItem.id);
  const tippBasketFuction = tippInBasket ? removeFromBasket : addToBasket;

  // TODO TIPP needs to change depending on if the title is in the KB or not

  const getPackageOption = () => {
    if (isLoading) {
      return ({
        icon: 'spinner-ellipsis',
        label: <FormattedMessage id="ui-agreements.gokbSearch.basket.addPackageToBasket" />,
        onClick: () => noop,
        disabled: true
      });
    }

    if (!isLoading && packages?.length === 0) {
      return (
        {
          icon: 'plus-sign',
          label: <FormattedMessage id="ui-agreements.gokbSearch.basket.noPackageMatches" />,
          onClick: () => noop,
          disabled: true
        }
      );
    }

    // Handle multiple package match case
    if (packages.length > 1) {
      return (
        {
          icon: 'times',
          label: <FormattedMessage id="ui-agreements.gokbSearch.basket.multiplePackageMatches" />,
          disabled: true
        }
      );
    }

    const pkg = packages[0];
    const packageInBasket = existsInBasket(pkg.id);
    const basketPackage = buildPackageEntitlementOption(pkg);
    const packageBasketFunction = packageInBasket ? removeFromBasket : addToBasket;

    const label = <FormattedMessage id={`ui-agreements.gokbSearch.basket.${packageInBasket ? 'removePackageFromBasket' : 'addPackageToBasket'}`} />;
    return ({
      icon: packageInBasket ? 'trash' : 'plus-sign',
      label,
      onClick: () => packageBasketFunction(basketPackage),
    });
  };

  return (
    <IconDropdown
      options={[
        {
          icon: tippInBasket ? 'trash' : 'plus-sign',
          label: <FormattedMessage id={`ui-agreements.gokbSearch.basket.${tippInBasket ? 'removeTitleFromBasket' : 'addTitleToBasket'}`} />,
          onClick: () => tippBasketFuction(tippBasketItem)
        },
        getPackageOption()
      ]}
    />
  );
};

const GoKbTIPPTable = ({ tipps }) => {
  // Shows a row per TIPP
  // IF the package is not yet in the DB, we can show the name, coverage and a warning in titleInKb?

  // We have to fetch the internal package for the GOKB package, and the internal PCIs for the GOKB TIPPs

  // Let's first deduplicate Pkg uuids
  const pkgIdentifiers = [];
  tipps.forEach((t) => {
    if (!pkgIdentifiers.includes(t.tippPackageUuid)) {
      pkgIdentifiers.push(t.tippPackageUuid);
    }
  });

  const packageIdentifiersQuery = pkgIdentifiers.map(pid => `(identifiers.identifier.ns.value==gokb_uuid&&identifiers.identifier.value==${pid}&&identifiers.status.value==approved)`).join('||');
  const packagesQueryParams = generateKiwtQueryParams({
    filters: [{
      value: packageIdentifiersQuery
    }],
    stats: false
  }, {});
  const { packages = [], packagesAreLoading } = usePackages({
    queryParams: packagesQueryParams
  });

  const getPackageInKb = (pkgUuid) => packages.find(p => (
    p.identifiers.find(io => (
      io.status?.value === 'approved' &&
      io.identifier.ns.value === 'gokb_uuid' &&
      io.identifier.value === pkgUuid
    )) !== null
  ));

  console.log("PACKAGES: %o", packages);

  // Next let's first deduplicate Title uuids
  const titleIdentifiers = [];
  tipps.forEach((t) => {
    if (!titleIdentifiers.includes(t.tippTitleUuid)) {
      titleIdentifiers.push(t.tippTitleUuid);
    }
  });


  const pciIdentifiersQuery = titleIdentifiers.map(pid => `(pti.ti.identifiers.identifier.ns.value==gokb_uuid&&pti.ti.identifiers.identifier.value==${pid}&&pti.ti.identifiers.status.value==approved)`).join('||');
  const pciQueryParams = generateKiwtQueryParams({
    filters: [{
      value: pciIdentifiersQuery
    }],
    stats: false
  }, {});
  const { pcis = [], pcisAreLoading } = usePackages({
    queryParams: packagesQueryParams
  });

  const getPackageInKb = (pkgUuid) => packages.find(p => (
    p.identifiers.find(io => (
      io.status?.value === 'approved' &&
      io.identifier.ns.value === 'gokb_uuid' &&
      io.identifier.value === pkgUuid
    )) !== null
  ));

  const visibleColumns = ['pkgName', 'coverage', 'platform', 'syncStatus', 'titleInKB', 'actions'];
  const formatter = {
    coverage: (rowData) => {
      // FIXME get PCI in KB

      return <Coverage pci={rowData} />;
    },
    pkgName: (rowData) => {
      const pkgInKB = getPackageInKb(rowData.tippPackageUuid);
      if (pkgInKB !== null) {
        return pkgInKB.name;
      }
      return rowData.tippPackageName; // Fallback to TIPP data if pkg data doesn't exist in KB
    },
    platform: (rowData) => {

      <TitleOnPlatformLink id={rowData.hostPlatformUuid} /*platform={}*/ /*name*/ url={rowData.hostPlatform} />
    },
    titleInKB: (rowData) => {
      const pkgInKB = getPackageInKb(rowData.tippPackageUuid);

      console.log("Pkg in KB: %o", pkgInKB);
    },
  };
  return (
    <MultiColumnList
      contentData={tipps}
      formatter={formatter}
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

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
  gokbTIPPResource.setRenderFunction('addToBasketButton', tipp => <GoKbBasketButton tipp={tipp} />);
  gokbTIPPResource.setRenderFunction('gokbTIPPTable', tipps => <GoKbTIPPTable tipps={tipps} />);
};

export default setUpRegistry;
