import omit from 'lodash/omit';
import { gokbTipps } from '../../../test/jest/GOKB';
import buildGokbTIPPEntitlementOption from './buildGokbTIPPEntitlementOption';
import { pkgs } from '../../../test/jest/eresources';

describe('buildGokbTIPPEntitlement', () => {
  describe.each([
    {
      tipp: gokbTipps[0],
      pkg: pkgs[0],
      label: 'with id',
      expectedId: gokbTipps[0].id
    },
    {
      tipp: omit(gokbTipps[0], 'id'),
      expectedId: gokbTipps[0].uuid,
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
        _object: tipp,
        id: expectedId,
        name: tipp.name,
        pkg,
        tipp,
        type: 'GOKB_TITLE'
      });
    });
  });
});
