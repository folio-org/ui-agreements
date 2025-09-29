import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { useQuery } from 'react-query';

import translationsProperties from '../../../test/helpers';
import RemoteResourceAgreementsList from './RemoteResourceAgreementsList';
import { entitlements, eresourceId, remoteId } from '../../../test/jest/GOKB/entitlements';

const mockEntitlementAgreementsList = jest.fn(() => <div data-testid="EntitlementAgreementsList" />);
jest.mock('../../components/EntitlementsAgreementsList', () => ({
  __esModule: true,
  default: (props) => mockEntitlementAgreementsList(props),
}));

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}));

describe('RemoteResourceAgreementsList (props & callbacks)', () => {
  const setBadgeCount = jest.fn();

  const renderIt = () => renderWithIntl(
    <MemoryRouter>
      <RemoteResourceAgreementsList
        remoteId={remoteId}
        setBadgeCount={setBadgeCount}
      />
    </MemoryRouter>,
    translationsProperties
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('passes eresourceId and entitlements to child, sets badge count', () => {
    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        expect(opts?.enabled).toBe(true);
        return { data: eresourceId };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        expect(opts?.enabled).toBe(true);
        opts?.onSuccess?.(entitlements);
        return { data: entitlements };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsList).toHaveBeenCalledTimes(1);
    const props = mockEntitlementAgreementsList.mock.calls[0][0];

    expect(props.eresourceId).toBe(eresourceId);
    expect(Array.isArray(props.entitlements)).toBe(true);
    expect(props.entitlements).toHaveLength(entitlements.length);
    expect(props.id).toBe('remote-resource-agreements-list');
    expect(props.visibleColumns).toEqual([
      'name', 'type', 'startDate', 'endDate', 'eresource', 'acqMethod', 'coverage', 'isCustomCoverage'
    ]);
    expect(props.isEmptyMessage).toBeUndefined();

    expect(setBadgeCount).toHaveBeenCalledWith(entitlements.length);
  });

  test('remote title not found, child gets null TI, empty entitlements, empty message set, no badge', () => {
    let entitlementsQueryOpts;
    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        expect(opts?.enabled).toBe(true);
        return { data: null };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        entitlementsQueryOpts = opts;
        expect(opts?.enabled).toBe(false);
        return { data: [] };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsList).toHaveBeenCalledTimes(1);
    const props = mockEntitlementAgreementsList.mock.calls[0][0];

    expect(props.eresourceId).toBeNull();
    expect(props.entitlements).toEqual([]);
    expect(props.isEmptyMessage?.props?.id).toBe('ui-agreements.remoteKb.remoteTitleNotFound');
    expect(entitlementsQueryOpts?.enabled).toBe(false);

    expect(setBadgeCount).not.toHaveBeenCalled();
  });

  test('TI found but no entitlements, child gets empty array, badge count set to 0', () => {
    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        return { data: eresourceId };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        const empty = [];
        opts?.onSuccess?.(empty);
        return { data: empty };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsList).toHaveBeenCalledTimes(1);
    const props = mockEntitlementAgreementsList.mock.calls[0][0];

    expect(props.eresourceId).toBe(eresourceId);
    expect(props.entitlements).toEqual([]);

    expect(setBadgeCount).toHaveBeenCalledWith(0);
  });

  test('select function in fetchLocalTitleId query works as expected', () => {
    let firstQueryOpts;
    let secondQueryOpts;

    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        firstQueryOpts = opts;
        expect(opts?.enabled).toBe(true);
        return { data: eresourceId };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        secondQueryOpts = opts;
        expect(opts?.enabled).toBe(true);
        return { data: entitlements };
      }
      return { data: undefined };
    });

    renderIt();

    expect(firstQueryOpts.select([{ id: 'abc' }])).toBe('abc');
    expect(firstQueryOpts.select([])).toBeNull();

    expect(secondQueryOpts?.enabled).toBe(true);
  });

  test('handles non-array entitlements and error in entitlements query by setting badge count to 0', () => {
    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        return { data: eresourceId };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        opts?.onSuccess?.({ not: 'an array' });
        opts?.onError?.(new Error('boom'));
        return { data: undefined };
      }
      return { data: undefined };
    });

    renderIt();

    expect(setBadgeCount).toHaveBeenCalledWith(0);
  });
});
