import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { externalEntitlements } from '../../../test/jest/entitlements';
import { AGREEMENT_LINES_EXTERNAL_ENDPOINT } from '../../constants';
import { useExternalEntitlements } from './useExternalEntitlements';

jest.unmock('react-query');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const DATA = externalEntitlements[0];

const mockGet = jest.fn().mockReturnValue({ json: () => Promise.resolve(DATA) });

describe('useExternalEntitlements', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch external entitlements with provided parameters', async () => {
    const searchParams = { authority: DATA.authority, reference: DATA.reference };

    const { result } = renderHook(() => useExternalEntitlements({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isFetched).toBeTruthy());

    expect(mockGet).toHaveBeenCalledWith(AGREEMENT_LINES_EXTERNAL_ENDPOINT, { searchParams });
    expect(result.current.data).toEqual(DATA);
  });
});
