import {
  useQuery,
  mockGetQueryReturn,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { mockKy } from '@folio/stripes/core';

import { externalEntitlements } from '../../../test/jest/entitlements';
import { AGREEMENT_LINES_EXTERNAL_ENDPOINT } from '../../constants';
import { useExternalEntitlements } from './useExternalEntitlements';

const customQueryNamespaceGenerator = jest.fn((searchParams, tenantId) => [
  'ERM',
  'AgreementLine',
  'external',
  AGREEMENT_LINES_EXTERNAL_ENDPOINT,
  searchParams,
  tenantId,
]);

describe('useExternalEntitlements', () => {
  describe.each([
    {
      testTitle: 'basic use',
      useExternalEntitlementsProps: {
        searchParams: { filter: 'test' },
      },
      expectedKyCall: AGREEMENT_LINES_EXTERNAL_ENDPOINT,
      expectedReturn: externalEntitlements[0],
      expectedQueryNamespace: customQueryNamespaceGenerator({ filter: 'test' }),
    },
    {
      testTitle: 'custom query namespace generator',
      useExternalEntitlementsProps: {
        searchParams: { filter: 'custom' },
      },
      expectedKyCall: AGREEMENT_LINES_EXTERNAL_ENDPOINT,
      expectedReturn: externalEntitlements[0],
      expectedQueryNamespace: customQueryNamespaceGenerator({ filter: 'custom' }),
    },
  ])('$testTitle', ({
    useExternalEntitlementsProps = {},
    expectedKyCall,
    expectedQueryNamespace,
    expectedQueryOpts,
    expectedReturn
  }) => {
    let result;

    beforeEach(() => {
      mockGetQueryReturn.mockImplementation(() => ({ data: expectedReturn }));

      result = renderHook(() => useExternalEntitlements(useExternalEntitlementsProps)).result;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should make a call with the expected path and search params', () => {
      expect(mockKy).toHaveBeenCalledWith(
        expectedKyCall,
        expect.objectContaining({ searchParams: useExternalEntitlementsProps.searchParams }),
      );
    });

    it('should return the expected data', () => {
      expect(result.current.data).toEqual(expectedReturn);
    });

    it('should call useQuery with the expected namespace and options', () => {
      if (typeof useExternalEntitlementsProps.queryNamespaceGenerator === 'function') {
        expect(customQueryNamespaceGenerator).toHaveBeenCalledWith(
          useExternalEntitlementsProps.searchParams,
          useExternalEntitlementsProps.tenantId,
        );
      }

      expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: expectedQueryNamespace,
        queryFn: expect.any(Function),
        ...expectedQueryOpts,
      }));
    });
  });
});
