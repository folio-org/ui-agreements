import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
} from '@folio/stripes/components';
// FIXME this really needs to be imported from stripes-core -- when https://github.com/folio-org/stripes-core/pull/1653 gets merged
// import { useChunkedIdTransformFetch } from '@folio/stripes/core';

import {
  TitleOnPlatformLink,
} from '@folio/stripes-erm-components';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';
import useChunkedIdTransformFetch from '../../../useChunkedIdTransformFetchLOCAL'; // FIXME Swap to stripes-core once merged

import {
  usePackages
} from '../../../hooks';
import Coverage from '../../../components/Coverage';
import { PCIS_ENDPOINT } from '../../../constants';

import GokbBasketButton from '../GokbBasketButton';

const GokbTIPPTable = ({ tipps = [] }) => {
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
  const { packages = [], arePackagesLoading } = usePackages({
    queryParams: packagesQueryParams
  });

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

  const { items: pcis, isLoading: arePcisLoading } = useChunkedIdTransformFetch({
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
          id={pciInKB?.id ?? rowData.uuid}
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

      return <GokbBasketButton
        pci={titleInKB}
        pciLoading={arePcisLoading}
        pkg={pkgInKB}
        pkgLoading={arePackagesLoading}
        tipp={rowData}
      />;
    }
  };

  return (
    <MultiColumnList
      columnMapping={{
        pkgName: <FormattedMessage id="ui-agreements.gokbSearch.basket.pkgName" />,
        coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
        platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
        syncStatus: <FormattedMessage id="ui-agreements.gokbSearch.basket.syncStatus" />,
        titleInKB: <FormattedMessage id="ui-agreements.gokbSearch.basket.titleInKB" />,
        actions: <FormattedMessage id="ui-agreements.actions" />,
      }}
      columnWidths={{ // Enforce certain widths
        coverage: 250,
        actions: 75
      }}
      contentData={tipps}
      formatter={formatter}
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

export default GokbTIPPTable;
