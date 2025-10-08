import { BASKET_TYPE_GOKB_TITLE } from '../../constants';

export default (tipp, pkg) => {
  const titleName = tipp?.tippTitleName || tipp?.name || tipp?.altname[0] || 'Unknown title';
  const publicationTypeLabel = tipp.titleType;
  const titleUuid = tipp.tippTitleUuid;
  const pkgUuid = tipp.tippPackageUuid;
  const reference = `${pkgUuid}:${titleUuid}`;

  return ({
    id: titleUuid,
    name: titleName,
    type: BASKET_TYPE_GOKB_TITLE,
    tipp,
    pkg,
    publicationType: { label: publicationTypeLabel },
    payload: {
      type: 'external',
      authority: 'GOKB-RESOURCE',
      reference,
      resourceName: titleName
    },
    titleUrl: `/erm/gokb/${titleUuid}`,
  });
};
