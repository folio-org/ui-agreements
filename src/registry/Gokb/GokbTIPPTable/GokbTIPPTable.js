import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
} from '@folio/stripes/components';
import { useChunkedIdTransformFetch } from '@folio/stripes/core';

import {
  TitleOnPlatformLink,
} from '@folio/stripes-erm-components';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import Coverage from '../../../components/Coverage';
import { PACKAGES_ENDPOINT, PCIS_ENDPOINT } from '../../../constants';

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

  const pkgChunkedQueryIdTransform = useCallback((chunkedIds) => {
    const queryParams = generateKiwtQueryParams({
      filters: [{
        value: chunkedIds.map((pkgId => {
          return `(
            identifiers.identifier.ns.value==gokb_uuid&&
            identifiers.identifier.value==${pkgId}&&
            identifiers.status.value==approved
          )`.replace(/[\s]/gm, ''); // Whitespace to make development easier but breaks query
        })).join('||')
      }],
      stats: false
    }, {});

    return queryParams.join('&');
  }, []);

  const { items: packages, isLoading: arePackagesLoading } = useChunkedIdTransformFetch({
    endpoint: PACKAGES_ENDPOINT,
    chunkedQueryIdTransform: pkgChunkedQueryIdTransform,
    ids: tipps.map(t => t.tippPackageUuid),
    reduceFunction: (queries) => (
      queries.reduce((acc, curr) => {
        return [...acc, ...(curr?.data ?? [])];
      }, [])
    ),
    STEP_SIZE: 10 // This doesn't return 414. Can actually get away with more probably but not much need to.
  });

  // We need all the title UUIDs AND the package UUIDs for them as well, otherwise we'll only be making calls for one PCI
  // The approach here is to get a list of ids structured as titleUUID:packageUUID, then feed them into useChunkedIdTransformFetch
  // which only accepts a 1-dimensional list of strings to transform.
  // We don't want to only fetch the PCIs by TITLE uuid in a chunked manner, as there could be an amount of those requiring pagination
  // For example if we chunk 20 at a time, and each has even 6 PCIs, then pagination comes into play.
  // useChunkedIdTransformFetch does NOT guarantee fetching all results if pagination is required
  // (at least not right now... there could be improvements made to it) and so instead to ensure that this will always work
  // even if the chunk size is tweaked, we fetch PCIs by title AND package, which _should_ be unique, hence only fetching
  // STEP_SIZE PCIs per fetch (which should be kept below 100 for the same reason as above)

  // So we construct our single-string representation of the 2D identifier space...
  const fetchIdentifiers = tipps.map((tipp) => {
    return `${tipp.tippTitleUuid}:${tipp.tippPackageUuid}`;
  });

  const pciChunkedQueryIdTransform = useCallback((chunkedIds) => {
    // We need to do funky things with the title identifiers list here because useChunkedIdTransformFetch ONLY accepts a list of string ids
    // So this will be titleId:packageId... not the cleanest though
    const queryParams = generateKiwtQueryParams({
      filters: [{
        value: chunkedIds.map((identifierPair => {
          const [titleId, packageId] = identifierPair.split(':');

          return `(
            pti.titleInstance.identifiers.identifier.ns.value==gokb_uuid&&
            pti.titleInstance.identifiers.identifier.value==${titleId}&&
            pti.titleInstance.identifiers.status.value==approved&&
            pkg.identifiers.identifier.ns.value==gokb_uuid&&
            pkg.identifiers.identifier.value==${packageId}&&
            pkg.identifiers.status.value==approved
          )`.replace(/[\s]/gm, ''); // Whitespace to make development easier but breaks query
        })).join('||')
      }],
      stats: false
    }, {});

    return queryParams.join('&');
  }, []);

  const { items: pcis, isLoading: arePcisLoading } = useChunkedIdTransformFetch({
    endpoint: PCIS_ENDPOINT,
    chunkedQueryIdTransform: pciChunkedQueryIdTransform,
    ids: fetchIdentifiers,
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
