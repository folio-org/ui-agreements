import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { ENABLED_ENGINES_QUERY_KEY } from '../constants';

const useEnabledEngines = ({
  endpoint // The BASE endpoint for accessControl, such as erm/accessControl for mod-agreements :)
}) => {
  const ky = useOkapiKy();

  const { data = {}, ...restOfQuery } = useQuery(
    [...ENABLED_ENGINES_QUERY_KEY, endpoint],
    () => ky.get(`${endpoint}/enabledEngines`).json()
  );

  return {
    enabledEngines: data,
    ...restOfQuery,
  };
};

export default useEnabledEngines;
