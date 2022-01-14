import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import { useOkapiKy } from '@folio/stripes/core';
import { useAcqMethods } from './useAcqMethods';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();

const MOCK_ACQ_METHOD = { id: 'acqMethodId', value: 'ACQ Method' };

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAcqMethods', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ acquisitionMethods: [MOCK_ACQ_METHOD] }),
        }),
      });
  });

  it('should fetch all acq methods', async () => {
    const { result, waitFor } = renderHook(() => useAcqMethods(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.acqMethods).toEqual([MOCK_ACQ_METHOD]);
  });
});
