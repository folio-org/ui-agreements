// RemoteResourceAgreementsList.props.test.js
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { useQuery } from 'react-query';

import translationsProperties from '../../../test/helpers';
import RemoteResourceAgreementsList from './RemoteResourceAgreementsList';
import { entitlements, eresourceId, remoteId } from '../../../test/jest/GOKB/entitlements';

const mockEntitlementAgreementsBaseList = jest.fn(() => <div data-testid="EntitlementAgreementsBaseList" />);
jest.mock('../../components/EntitlementsAgreementsList', () => ({
  EntitlementAgreementsBaseList: (props) => mockEntitlementAgreementsBaseList(props),
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
        return { data: eresourceId };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        opts?.onSuccess?.(entitlements);
        return { data: entitlements };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsBaseList).toHaveBeenCalledTimes(1);
    const props = mockEntitlementAgreementsBaseList.mock.calls[0][0];

    expect(props.eresourceId).toBe(eresourceId);
    expect(Array.isArray(props.entitlements)).toBe(true);
    expect(props.entitlements).toHaveLength(entitlements.length);
    expect(props.id).toBe('remote-resource-agreements-list');

    expect(setBadgeCount).toHaveBeenCalledWith(entitlements.length);
  });

  test('remote title not found, child gets null TI, empty entitlements, empty message set, no badge', () => {
    useQuery.mockImplementation((key) => {
      if (key[1] === 'fetchLocalTitleId') {
        return { data: null }; // select() would yield null
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        // would be disabled, but returning empty keeps props stable
        return { data: [] };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsBaseList).toHaveBeenCalledTimes(1);
    const props = mockEntitlementAgreementsBaseList.mock.calls[0][0];

    expect(props.eresourceId).toBeNull();
    expect(props.entitlements).toEqual([]);
    // FormattedMessage instance → check the id prop
    expect(props.isEmptyMessage?.props?.id).toBe('ui-agreements.remoteKb.remoteTitleNotFound');

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

    expect(mockEntitlementAgreementsBaseList).toHaveBeenCalledTimes(1);
    const props = mockEntitlementAgreementsBaseList.mock.calls[0][0];

    expect(props.eresourceId).toBe(eresourceId);
    expect(props.entitlements).toEqual([]);

    expect(setBadgeCount).toHaveBeenCalledWith(0);
  });
});
