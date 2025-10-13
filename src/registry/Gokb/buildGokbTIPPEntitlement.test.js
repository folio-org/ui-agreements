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

  describe('title resolution priority', () => {
    const baseTipp = {
      tippTitleUuid: 'tt-uuid-1',
      tippPackageUuid: 'pkg-uuid-1',
      titleType: 'Journal',
    };
    const pkg = pkgs[0];

    test('uses tipp.tippTitleName when present (preferred over name)', () => {
      const tipp = {
        ...baseTipp,
        tippTitleName: 'Preferred Title',
        name: 'Fallback Name',
        altname: ['Alt Name A', 'Alt Name B'],
      };

      const out = buildGokbTIPPEntitlementOption(tipp, pkg);
      expect(out).toEqual({
        id: 'tt-uuid-1',
        name: 'Preferred Title',
        type: BASKET_TYPE_GOKB_TITLE,
        tipp,
        pkg,
        publicationType: { label: 'Journal' },
        payload: {
          type: 'external',
          authority: GOKB_RESOURCE_AUTHORITY,
          reference: 'pkg-uuid-1:tt-uuid-1',
          resourceName: 'Preferred Title',
        },
      });
    });

    test('uses altname[0] when no tippTitleName and no name', () => {
      const tipp = {
        ...baseTipp,
        altname: ['Alt Name Only'],
      };

      const out = buildGokbTIPPEntitlementOption(tipp, pkg);
      expect(out).toEqual({
        id: 'tt-uuid-1',
        name: 'Alt Name Only',
        type: BASKET_TYPE_GOKB_TITLE,
        tipp,
        pkg,
        publicationType: { label: 'Journal' },
        payload: {
          type: 'external',
          authority: GOKB_RESOURCE_AUTHORITY,
          reference: 'pkg-uuid-1:tt-uuid-1',
          resourceName: 'Alt Name Only',
        },
      });
    });

    test('falls back to "Unknown title" when no tippTitleName, no name, and no altname', () => {
      const tipp = {
        ...baseTipp,
      };

      const out = buildGokbTIPPEntitlementOption(tipp, pkg);
      expect(out).toEqual({
        id: 'tt-uuid-1',
        name: 'Unknown title',
        type: BASKET_TYPE_GOKB_TITLE,
        tipp,
        pkg,
        publicationType: { label: 'Journal' },
        payload: {
          type: 'external',
          authority: GOKB_RESOURCE_AUTHORITY,
          reference: 'pkg-uuid-1:tt-uuid-1',
          resourceName: 'Unknown title',
        },
      });
    });
  });
});
