import { BASKET_TYPE_GOKB_TITLE, GOKB_RESOURCE_AUTHORITY } from '../../constants';

export default (tipp, pkg) => {
  const titleName = tipp?.tippTitleName || tipp?.name || tipp?.altname[0] || 'Unknown title';
  const titleUuid = tipp.tippTitleUuid;
  const pkgUuid = tipp.tippPackageUuid;
  const reference = `${pkgUuid}:${titleUuid}`;
  return ({
    id: titleUuid,
    name: titleName,
    type: BASKET_TYPE_GOKB_TITLE,
    tipp,
    pkg,
    publicationType: { label: tipp?.titleType },
    payload: {
      type: 'external',
      authority: GOKB_RESOURCE_AUTHORITY,
      reference,
      resourceName: titleName,
    },
  });
};
