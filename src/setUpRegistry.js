import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  IconButton,
  MultiColumnList,
  Tooltip
} from '@folio/stripes/components';
// import { useChunkedIdTransformFetch } from '@folio/stripes/core';
import useChunkedIdTransformFetch from './useChunkedIdTransformFetchDONOTMERGE'; // FIXME Swap to stripes-core once merged

import {
  InternalContactsArrayDisplay,
  OrganizationsArrayDisplay,
  TitleOnPlatformLink,
} from '@folio/stripes-erm-components';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import AgreementLookup from './AgreementLookup';
import {
  useBasket,
  usePackages
} from './hooks';

import IconDropdown from './components/IconDropdown';
import { buildPackageEntitlementOption } from './components/utilities';
import Coverage from './components/Coverage';

import { PCICoverage } from './components/EResourceSections';
import { PCIS_ENDPOINT } from './constants';
// This should probably eventually come from kint comps

// Temporary button component for adding GoKB title/package to basket FROM a TIPP resource
const GoKbBasketButton = ({
  tipp, // The GOKB tipp record
  pci, // The PCI in local KB (if exists)
  pciLoading, // Is the query which fetches the PCIs still loading?
  pkg, // The PKG in local KB (if exists)
  pkgLoading // Is the query which fetches the PCIs still loading?
}) => {
  // FIXME For PACKAGE level we need to fetch the internal package and either add it as is or not give the option
  const { addToBasket, existsInBasket, removeFromBasket } = useBasket();


  if (!pkg && !pkgLoading) {
    // This is an iconButton so we can do a tooltip
    return (
      <Tooltip
        id={`pkg-for-tipp-${tipp.uuid}-not.present`}
        text={<FormattedMessage id="ui-agreements.gokbSearch.basket.packageNameNotInKB" values={{ name: tipp.tippPackageName }} />}
      >
        {({ ref, ariaIds }) => (
          <IconButton
            ref={ref}
            aria-describedby={ariaIds.sub}
            aria-labelledby={ariaIds.text}
            icon="ellipsis"
          />
        )}
      </Tooltip>
    );
  }

  // FIXME IF TITLE IS IN KB WE SHOULD DO SOMETHING DIFFERENT OFC
  const tippBasketItem = {
    id: tipp.uuid || tipp.id,
    name: tipp.name,
    type: 'GoKBTitle',
  };
  const tippInBasket = existsInBasket(tippBasketItem.id);
  const tippBasketFuction = tippInBasket ? removeFromBasket : addToBasket;

  // TODO TIPP needs to change depending on if the title is in the KB or not

  const getPackageOption = () => {
    if (pkgLoading) {
      return ({
        icon: 'spinner-ellipsis',
        label: <FormattedMessage id="ui-agreements.gokbSearch.basket.addPackageToBasket" />,
        onClick: () => noop,
        disabled: true
      });
    }

    if (!pkgLoading && !pkg) {
      return (
        {
          icon: 'plus-sign',
          label: <FormattedMessage id="ui-agreements.gokbSearch.basket.noPackageMatches" />,
          onClick: () => noop,
          disabled: true
        }
      );
    }

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
      triggerProps={{
        'aria-label': 'wibble',
        tooltipProps: {
          id: `manage-basket-for-${tipp.uuid}`,
          text: <FormattedMessage id="ui-agreements.gokbSearch.basket.manageBasketForPackageName" values={{ name: tipp.tippPackageName }} />
        }
      }}
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

  console.log("PACKAGES: %o", packages);

  // Next let's first deduplicate Title uuids
  const titleIdentifiers = [];
  tipps.forEach((t) => {
    if (!titleIdentifiers.includes(t.tippTitleUuid)) {
      titleIdentifiers.push(t.tippTitleUuid);
    }
  });

  const pciChunkedQueryIdTransform = useCallback((chunkedIds) => {
    // We need to do funky things with the title identifiers list here because useChunkedIdTransformFetch ONLY accepts a list of string ids
    // So we will in turn use that list to lookup in tipps again here for the titleUuid AND packageUuid -- this isn't particularly clean though
    const queryParams = generateKiwtQueryParams({
      filters: [{
        value: chunkedIds.map((titleId => {
          const relevantTipp = tipps.find(t => t.tippTitleUuid === titleId);

          return `(
            pti.titleInstance.identifiers.identifier.ns.value==gokb_uuid&&
            pti.titleInstance.identifiers.identifier.value==${titleId}&&
            pti.titleInstance.identifiers.status.value==approved&&
            pkg.identifiers.identifier.ns.value==gokb_uuid&&
            pkg.identifiers.identifier.value==${relevantTipp.tippPackageUuid}&&
            pkg.identifiers.status.value==approved
          )`.replace(/[\s]/gm, ''); // Whitespace to make development easier but breaks query
        })).join('||')
      }],
      stats: false
    }, {});
    return `?${queryParams.join('&')}`;
  }, [tipps]);

  const { items: pcis, isLoading: arePcisLoading} = useChunkedIdTransformFetch({
    endpoint: PCIS_ENDPOINT,
    chunkedQueryIdTransform: pciChunkedQueryIdTransform,
    ids: titleIdentifiers,
    reduceFunction: (queries) => (
      queries.reduce((acc, curr) => {
        return [...acc, ...(curr?.data ?? [])];
      }, [])
    ),
    STEP_SIZE: 7 // This doesn't return 414
  });

  console.log("PCIS: %o", pcis);

  const getPackageInKb = (pkgUuid) => {
    const filteredPackages = packages.filter(p => (
      p.identifiers.find(io => (
        io.status?.value === 'approved' &&
        io.identifier.ns.value === 'gokb_uuid' &&
        io.identifier.value === pkgUuid
      ))
    ));

    // If we find multiple packages, for now grab the first one... is this an ok pattern?
    return filteredPackages[0];
  };

  const getPCIInKB = (titleUuid, packageUuid) => {
    const filteredPCIs = pcis.filter(pci => (
      pci.pti.titleInstance.identifiers.find(io => (
        io.status?.value === 'approved' &&
        io.identifier.ns.value === 'gokb_uuid' &&
        io.identifier.value === titleUuid
      )) &&
      pci.pkg.identifiers.find(io => (
        io.status?.value === 'approved' &&
        io.identifier.ns.value === 'gokb_uuid' &&
        io.identifier.value === packageUuid
      ))
    ));

    // If we find multiple PCIs, for now grab the first one... is this an ok pattern?
    return filteredPCIs[0];
  };

  const visibleColumns = ['pkgName', 'coverage', 'platform', 'syncStatus', 'titleInKB', 'actions'];
  const formatter = {
    coverage: (rowData) => {
      const pciInKB = getPCIInKB(rowData.tippTitleUuid, rowData.tippPackageUuid);
      return (
        <Coverage
          pci={pciInKB ?? rowData}
        />
      ); // GOKB Coverage shape happens to be similar to ours, but this feels flaky.
    },
    pkgName: (rowData) => {
      const pkgInKB = getPackageInKb(rowData.tippPackageUuid);
      if (pkgInKB) { // Truthy cast here :(
        return <Link to={`/erm/packages/${pkgInKB.id}`}>{pkgInKB.name}</Link>;
      }
      return rowData.tippPackageName; // Fallback to TIPP data if pkg data doesn't exist in KB
    },
    platform: (rowData) => {
      const pciInKB = getPCIInKB(rowData.tippTitleUuid, rowData.tippPackageUuid);

      return (
        // Use pci data from KB if it exists
        <TitleOnPlatformLink
          id={pciInKB?.id ?? rowData.id}
          // THIS FEELS VERY WRONG -- BUT IS ANALAGOUS TO BACKEND?
          name={
            pciInKB?.pti?.name ??
            `'${rowData.tippTitleName}' on Platform '${rowData.hostPlatformName}'`}
          platform={pciInKB?.pti?.platform?.name ?? rowData.hostPlatformName}
          url={pciInKB?.pti?.url ?? rowData.url}
        />
      );
    },
    syncStatus: (rowData) => {
      const pkgInKB = getPackageInKb(rowData.tippPackageUuid);
      return (
        <FormattedMessage
          id={
            pkgInKB ?
              `ui-agreements.eresources.syncContentsFromSource.${pkgInKB.syncContentsFromSource}` :
              'ui-agreements.gokbSearch.basket.packageNotInKB'
          }
        />
      );
    },
    titleInKB: (rowData) => {
      const titleInKB = getPCIInKB(rowData.tippTitleUuid, rowData.tippPackageUuid);

      if (!titleInKB) {
        return <FormattedMessage id="ui-agreements.gokbSearch.basket.titleNotInKB" />;
      }

      return <Link to={`/erm/titles/${titleInKB.id}`}><FormattedMessage id="ui-agreements.gokbSearch.basket.viewInKB" /></Link>;
    },
    actions: (rowData) => {
      const pkgInKB = getPackageInKb(rowData.tippPackageUuid);
      const titleInKB = getPCIInKB(rowData.tippTitleUuid, rowData.tippPackageUuid);

      return <GoKbBasketButton
        pci={titleInKB}
        pkg={pkgInKB}
        tipp={rowData}
      />;
    }
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
