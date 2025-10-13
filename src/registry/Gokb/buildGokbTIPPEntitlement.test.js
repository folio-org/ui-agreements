import omit from 'lodash/omit';
import { gokbTipps } from '../../../test/jest/GOKB';
import { GOKB_RESOURCE_AUTHORITY, BASKET_TYPE_GOKB_TITLE } from '../../constants';
import buildGokbTIPPEntitlementOption from './buildGokbTIPPEntitlementOption';
import { pkgs } from '../../../test/jest/eresources';

describe('buildGokbTIPPEntitlement', () => {
  describe.each([
    {
      tipp: gokbTipps[0],
      pkg: pkgs[0],
      label: 'with id',
      expectedId: gokbTipps[0].tippTitleUuid
    },
    {
      tipp: omit(gokbTipps[0], 'id'),
      expectedId: gokbTipps[0].tippTitleUuid,
      pkg: pkgs[0],
      label: 'without id'
    }
  ])('testing how buildGokbTIPPEntitlement behaves $label', ({
    expectedId,
    pkg,
    tipp
  }) => {
    let outcome;
    beforeEach(() => {
      outcome = buildGokbTIPPEntitlementOption(tipp, pkg);
    });

    test('outcome is as expected', () => {
      expect(outcome).toEqual({
        id: expectedId,
        name: tipp.name,
        pkg,
        publicationType: { label: tipp?.titleType },
        payload: {
          type: 'external',
          authority: GOKB_RESOURCE_AUTHORITY,
          reference: `${tipp.tippPackageUuid}:${tipp.tippTitleUuid}`,
          resourceName: tipp.name,
        },
        tipp,
        type: BASKET_TYPE_GOKB_TITLE
      });
    });
  });
});
