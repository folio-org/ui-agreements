import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { KBS_ENDPOINT } from '../constants/endpoints';

const useExternalKbInfo = () => {
  const ky = useOkapiKy();

  const PARAMS = useMemo(() => ([
    'filters=type==org.olf.kb.adapters.GOKbOAIAdapter',
    'filters=active==true',
    'sort=name;asc',
  ]), []);

  const paramsQuery = useMemo(() => PARAMS.join('&'), [PARAMS]);

  const extractBaseOrigin = (uri) => {
    try {
      return uri ? new URL(uri).origin : undefined;
    } catch {
      return undefined;
    }
  };

  const {
    data = [],
    error,
    isLoading,
    isError,
  } = useQuery(
    ['ERM', 'ExternalKB', paramsQuery, KBS_ENDPOINT],
    () => ky.get(`${KBS_ENDPOINT}?${paramsQuery}`).json()
  );

  const kbCount = Array.isArray(data) ? data.length : 0;
  const selected = kbCount > 0 ? data[0] : undefined;

  return {
    baseOrigin: extractBaseOrigin(selected?.uri),
    kbName: selected?.name,
    kbCount,
    isLoading,
    isError,
    error,
  };
};

export default useExternalKbInfo;
