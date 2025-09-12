import { BASKET_TYPE_GOKB_TITLE } from '../../constants';

export default (tipp, pkg) => {
  return ({
    id: tipp.id || tipp.uuid,
    name: tipp.name,
    type: BASKET_TYPE_GOKB_TITLE,
    tipp,
    pkg,
    _object: tipp
  });
};
