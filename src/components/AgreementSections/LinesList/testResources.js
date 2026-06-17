const mkPkgResource = ({ id, name, vendorName }) => ({
  id,
  class: 'org.olf.kb.Pkg',
  name,
  suppressFromDiscovery: false,
  tags: [],
  customCoverage: false,
  _object: {
    id,
    name,
    vendor: { id: `vendor-${id}`, name: vendorName },
    class: 'org.olf.kb.Pkg',
  },
});

const mkPkgLine = ({ id, pkgName, vendorName, poLines = [] }) => ({
  id,
  owner: { id: 'owner-1' },
  resource: mkPkgResource({ id: `pkg-${id}`, name: pkgName, vendorName }),
  poLines,
  suppressFromDiscovery: false,
  customCoverage: false,
  explanation: 'Agreement includes a package containing this item',
  haveAccess: true,
  startDate: null,
  endDate: null,
  activeFrom: null,
  activeTo: null,
  contentUpdated: null,
});

const mkExternalTitleLine = ({
  authority,
  id,
  reference,
  resourceName,
  ...rest
}) => ({
  id,
  type: 'external',
  authority,
  reference,
  resourceName,
  haveAccess: true,
  suppressFromDiscovery: false,
  customCoverage: false,
  startDate: null,
  endDate: null,
  activeFrom: null,
  activeTo: null,
  contentUpdated: null,
  poLines: [],
  owner: { id: 'owner-2' },
  ...rest,
});

const agreement = {
  id: 'agreement-1',
  name: 'AM ag 1',
  agreementLinesCount: 5,
  orderLines: [
    {
      id: '1bcd1b4f-df7d-48a3-b2c9-6fc0a0cc2c7e',
      poLineNumber: '20-1',
      titleOrPackage: 'Test PO Line title',
    }
  ],
  lines: [
    mkPkgLine({
      id: 'line-1',
      pkgName: 'ACS in Focus Test',
      vendorName: 'American Chemical Society',
      poLines: [{ id: 'pol-1', poLineId: '1bcd1b4f-df7d-48a3-b2c9-6fc0a0cc2c7e' }],
    }),
    mkPkgLine({
      id: 'line-2',
      pkgName: 'American Society of Civil Engineers : Journals',
      vendorName: 'American Society of Civil Engineers',
    }),
    mkExternalTitleLine({
      id: 'line-3',
      authority: 'EKB-TITLE',
      reference: '22-1887786-11234147a',
      resourceName: 'Missing eHoldings title',
      reference_object: {
        error: 404,
        message: 'Not Found',
      },
      note: 'This note should not display for an errored eHoldings line',
      startDate: '2026-05-01',
      endDate: '2026-05-31',
    }),
    mkExternalTitleLine({
      id: 'line-4',
      authority: 'GOKB-RESOURCE',
      reference: '3a3736cd-23d4-46c2-9899-d14fd136f49f:2d45d36b-5454-450a-bfa8-fa51eefbe61f',
      resourceName: '14th century English mystics newsletter',
    }),
    mkExternalTitleLine({
      id: 'line-5',
      authority: 'GOKB-RESOURCE',
      reference: 'bc634143-36ed-4ae2-a991-5e35ae4fee6a:e2a8df5b-4d2c-4f65-82f4-fbd96f43538c',
    }),
  ],
};

export default agreement;
