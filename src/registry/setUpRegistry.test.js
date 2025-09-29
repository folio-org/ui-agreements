import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  InternalContactsArrayDisplay,
  OrganizationsArrayDisplay,
} from '@folio/stripes-erm-components';
import setUpRegistry from './setUpRegistry';

import AgreementLookup from '../AgreementLookup';

import { GokbBasketButton, GokbTIPPTable } from './Gokb';
import RemoteResourceAgreementsList from './RemoteResourceAgreementsList';

const makeRegistryMock = () => {
  const resources = {};

  const registerResource = jest.fn((name) => {
    const r = {
      name,
      renderers: {},
      viewResourcesArg: undefined,
      viewResourceFn: undefined,
      lookupComponent: undefined,

      setViewResources: jest.fn((arg) => {
        r.viewResourcesArg = arg;
      }),

      setViewResource: jest.fn((fn) => {
        r.viewResourceFn = fn;
      }),

      setRenderFunction: jest.fn((key, fn) => {
        r.renderers[key] = fn;
      }),

      setLookupComponent: jest.fn((comp) => {
        r.lookupComponent = comp;
      }),
    };
    resources[name] = r;
    return r;
  });

  return { registerResource, resources };
};

describe('setUpRegistry', () => {
  let registry;

  beforeEach(() => {
    registry = makeRegistryMock();
    setUpRegistry(registry);
  });

  test('registers expected resources', () => {
    expect(registry.registerResource).toHaveBeenCalledWith('agreement');
    expect(registry.registerResource).toHaveBeenCalledWith('entitlements');
    expect(registry.registerResource).toHaveBeenCalledWith('ermPackage');
    expect(registry.registerResource).toHaveBeenCalledWith('remoteKb');

    expect(Object.keys(registry.resources)).toEqual(
      expect.arrayContaining(['agreement', 'entitlements', 'ermPackage', 'remoteKb'])
    );
  });

  describe('agreement resource', () => {
    test('configures view routes and lookup component', () => {
      const agreement = registry.resources.agreement;

      expect(agreement.setViewResources).toHaveBeenCalledWith('/erm/agreements');
      expect(agreement.viewResourcesArg).toBe('/erm/agreements');

      expect(typeof agreement.viewResourceFn).toBe('function');
      const viewUrl = agreement.viewResourceFn({ id: 'a1' });
      expect(viewUrl).toBe('/erm/agreements/a1');

      expect(agreement.lookupComponent).toBe(AgreementLookup);
      expect(agreement.setLookupComponent).toHaveBeenCalledWith(AgreementLookup);
    });

    test('internalContacts renderer returns InternalContactsArrayDisplay with contacts', () => {
      const fn = registry.resources.agreement.renderers.internalContacts;
      expect(typeof fn).toBe('function');

      const record = { contacts: [{ name: 'Jane' }] };
      const el = fn(record);
      expect(el.type).toBe(InternalContactsArrayDisplay);
      expect(el.props.contacts).toBe(record.contacts);
    });

    test('orgs renderer returns OrganizationsArrayDisplay with orgs', () => {
      const fn = registry.resources.agreement.renderers.orgs;
      expect(typeof fn).toBe('function');

      const record = { orgs: [{ org: 'Test Org' }] };
      const el = fn(record);
      expect(el.type).toBe(OrganizationsArrayDisplay);
      expect(el.props.orgs).toBe(record.orgs);
    });
  });

  describe('entitlements (agreementLine) resource', () => {
    test('configures list/view routes and parentAgreement renderer (Link)', () => {
      const agl = registry.resources.entitlements;

      expect(agl.setViewResources).toHaveBeenCalledWith('/erm/agreementLines');

      expect(typeof agl.viewResourceFn).toBe('function');
      const viewUrl = agl.viewResourceFn({ id: 'al-1', owner: { id: 'agr-9' } });
      expect(viewUrl).toBe('/erm/agreementLines/al-1/agreement/agr-9');

      const parentAgreement = agl.renderers.parentAgreement;
      expect(typeof parentAgreement).toBe('function');

      const record = { owner: { id: 'agr-22', name: 'Agreement 22' } };
      const node = parentAgreement(record);

      const { getByRole } = render(<MemoryRouter>{node}</MemoryRouter>);
      const link = getByRole('link', { name: 'Agreement 22' });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe('/erm/agreements/agr-22');
    });
  });

  describe('ermPackage resource', () => {
    test('configures view path function', () => {
      const pkg = registry.resources.ermPackage;
      expect(typeof pkg.viewResourceFn).toBe('function');
      const viewUrl = pkg.viewResourceFn({ id: 'pkg-7' });
      expect(viewUrl).toBe('/erm/packages/pkg-7');
    });
  });

  describe('remoteKb resource', () => {
    test('gokbAddToBasketButton renderer passes tipp', () => {
      const fn = registry.resources.remoteKb.renderers.gokbAddToBasketButton;
      expect(typeof fn).toBe('function');

      const tipp = { id: 't1' };
      const el = fn({ tipp });
      expect(el.type).toBe(GokbBasketButton);
      expect(el.props.tipp).toBe(tipp);
    });

    test('gokbTippTable renderer passes tipps', () => {
      const fn = registry.resources.remoteKb.renderers.gokbTippTable;
      expect(typeof fn).toBe('function');

      const tipps = [{ id: 't1' }, { id: 't2' }];
      const el = fn({ tipps });
      expect(el.type).toBe(GokbTIPPTable);
      expect(el.props.tipps).toBe(tipps);
    });

    test('agreementsList renderer passes remoteId and setBadgeCount', () => {
      const fn = registry.resources.remoteKb.renderers.agreementsList;
      expect(typeof fn).toBe('function');

      const setBadgeCount = jest.fn();
      const el = fn({ remoteId: 'kb-123', setBadgeCount });
      expect(el.type).toBe(RemoteResourceAgreementsList);
      expect(el.props.remoteId).toBe('kb-123');
      expect(el.props.setBadgeCount).toBe(setBadgeCount);
    });
  });
});
