/* Turn Basket's "selectedItems" string (e.g. "0,2,5") and basket array
into the Agreement payload items.
- Non-GOKB entries: { resource: item }  (unchanged behavior)
- GOKB titles:
      { type: 'external', authority: 'GOKB-RESOURCE', reference: '<pkgUuid>:<titleUuid>' resourceName: resource.name } */

export const buildEntitlementsFromBasketSelection = (selection, basket) => {
  const indices = String(selection)
    .split(',')
    .map((s) => parseInt(s, 10))
    .filter(Number.isFinite);

  return indices
    .map((idx) => basket[idx])
    .filter(Boolean)
    .map((item) => {
      if (item?.type === 'GOKB_TITLE') {
        const pkgUuid = item?.tipp?.tippPackageUuid ?? item?._object?.tippPackageUuid;
        const titleUuid = item?.tipp?.tippTitleUuid ?? item?._object?.tippTitleUuid;
        if (!pkgUuid || !titleUuid) return null;

        return {
          type: 'external',
          authority: 'GOKB-RESOURCE',
          reference: `${pkgUuid}:${titleUuid}`,
          resourceName: item?.name || item?.tipp?.name || item?.tipp?.altname || 'Unknown title',
        };
      }

      return { resource: item };
    })
    .filter(Boolean);
};
