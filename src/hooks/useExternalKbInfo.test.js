import { renderWithIntl } from '@folio/stripes-erm-testing';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import useExternalKbInfo from './useExternalKbInfo';
import { KBS_ENDPOINT } from '../constants/endpoints';
import translationsProperties from '../../test/helpers';

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

describe('useExternalKbInfo', () => {
  let ky;
  let hookResult;

  const TestComponent = () => {
    hookResult = useExternalKbInfo();
    return null;
  };

  beforeEach(() => {
    hookResult = undefined;

    ky = {
      get: jest.fn(() => ({
        json: jest.fn(() => Promise.resolve([])),
      })),
    };

    useOkapiKy.mockReturnValue(ky);

    useQuery.mockImplementation(() => ({
      data: [],
      error: undefined,
      isLoading: false,
      isError: false,
    }));
  });

  test('builds query using paramsQuery and endpoint', async () => {
    renderWithIntl(<TestComponent />, translationsProperties);

    expect(useQuery).toHaveBeenCalledWith(
      [
        'ERM',
        'ExternalKB',
        'filters=type==org.olf.kb.adapters.GOKbOAIAdapter&filters=active==true&sort=name;asc',
        KBS_ENDPOINT,
      ],
      expect.any(Function)
    );

    const queryFn = useQuery.mock.calls[0][1];
    await queryFn();

    expect(ky.get).toHaveBeenCalledWith(
      `${KBS_ENDPOINT}?filters=type==org.olf.kb.adapters.GOKbOAIAdapter&filters=active==true&sort=name;asc`
    );
  });

  test('returns baseOrigin, kbName and kbCount from first result', () => {
    useQuery.mockImplementation(() => ({
      data: [{ name: 'GOKb_TEST', uri: 'https://gokbt.gbv.de/gokb/oai/index' }],
      error: undefined,
      isLoading: false,
      isError: false,
    }));

    renderWithIntl(<TestComponent />, translationsProperties);

    expect(hookResult.kbCount).toBe(1);
    expect(hookResult.kbName).toBe('GOKb_TEST');
    expect(hookResult.baseOrigin).toBe('https://gokbt.gbv.de');
  });

  test('returns undefined baseOrigin for invalid uri', () => {
    useQuery.mockImplementation(() => ({
      data: [{ name: 'Broken', uri: 'not-a-url' }],
      error: undefined,
      isLoading: false,
      isError: false,
    }));

    renderWithIntl(<TestComponent />, translationsProperties);

    expect(hookResult.baseOrigin).toBeUndefined();
    expect(hookResult.kbName).toBe('Broken');
    expect(hookResult.kbCount).toBe(1);
  });

  test('handles non-array data', () => {
    useQuery.mockImplementation(() => ({
      data: { foo: 'bar' },
      error: undefined,
      isLoading: false,
      isError: false,
    }));

    renderWithIntl(<TestComponent />, translationsProperties);

    expect(hookResult.kbCount).toBe(0);
    expect(hookResult.kbName).toBeUndefined();
    expect(hookResult.baseOrigin).toBeUndefined();
  });

  test('passes through loading and error flags', () => {
    useQuery.mockImplementation(() => ({
      data: [],
      error: 'boom',
      isLoading: true,
      isError: true,
    }));

    renderWithIntl(<TestComponent />, translationsProperties);

    expect(hookResult.isLoading).toBe(true);
    expect(hookResult.isError).toBe(true);
    expect(hookResult.error).toBe('boom');
  });
});
