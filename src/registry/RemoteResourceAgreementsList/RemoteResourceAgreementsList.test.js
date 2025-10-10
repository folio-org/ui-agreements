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

jest.mock('@k-int/stripes-kint-components', () => {
  const actual = jest.requireActual('@k-int/stripes-kint-components');
  return {
    ...actual,
    usePrevNextPagination: jest.fn(() => ({
      currentPage: 1,
      paginationMCLProps: {
        onNeedMoreData: jest.fn(),
        pagingCanGoNext: false,
        pagingCanGoPrevious: false,
        pagingOffset: 0,
        pagingType: 'prev-next'
      },
      handlePageChange: jest.fn(),
      resetPage: jest.fn(),
    })),
  };
});

jest.mock('../../hooks', () => {
  const actual = jest.requireActual('../../hooks');
  return {
    ...actual,
    useAgreementsDisplaySettings: jest.fn(() => ({})),
  };
});

jest.mock('../../components/utilities', () => {
  const actual = jest.requireActual('../../components/utilities');
  return {
    ...actual,
    parseMclPageSize: jest.fn(() => 1),
  };
});

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
        const payload = { results: entitlements, totalRecords: entitlements.length };
        opts?.onSuccess?.(payload);
        return { data: payload };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsList).toHaveBeenCalled();
    const props = mockEntitlementAgreementsList.mock.calls.at(-1)[0];

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

  test('remote title not found, renders message (no child), entitlements query disabled, no badge', () => {
    let entitlementsQueryOpts;
    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        expect(opts?.enabled).toBe(true);
        return { data: null };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        entitlementsQueryOpts = opts;
        expect(opts?.enabled).toBe(false);
        return { data: { results: [], totalRecords: 0 } };
      }
      return { data: undefined };
    });

    const { queryByText } = renderIt();

    expect(mockEntitlementAgreementsList).not.toHaveBeenCalled();
    const messageNode = queryByText('Title not currently present in Local KB. To add the title, synchronise one of the packages listed in the Packages accordion');
    expect(messageNode).toBeInTheDocument();

    expect(entitlementsQueryOpts?.enabled).toBe(false);

    expect(setBadgeCount).not.toHaveBeenCalled();
  });

  test('TI found but no entitlements, child gets empty array, badge count set to 0', () => {
    useQuery.mockImplementation((key, _fn, opts) => {
      if (key[1] === 'fetchLocalTitleId') {
        return { data: eresourceId };
      }
      if (key[1] === 'fetchEntitlementsForTitle') {
        const emptyPayload = { results: [], totalRecords: 0 };
        opts?.onSuccess?.(emptyPayload);
        return { data: emptyPayload };
      }
      return { data: undefined };
    });

    renderIt();

    expect(mockEntitlementAgreementsList).toHaveBeenCalled();
    const props = mockEntitlementAgreementsList.mock.calls.at(-1)[0];

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
        return { data: { results: entitlements, totalRecords: entitlements.length } };
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
        const weird = { not: 'an array' };
        opts?.onSuccess?.(weird);
        opts?.onError?.(new Error('boom'));
        return { data: undefined };
      }
      return { data: undefined };
    });

    renderIt();

    expect(setBadgeCount).toHaveBeenCalledWith(0);
  });
});
