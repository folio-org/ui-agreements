import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import baseKy from 'ky';
import GokbTIPPTable from '../Gokb/GokbTIPPTable';

const propTypes = {
  resourceId: PropTypes.string.isRequired,
  setBadgeCount: PropTypes.func.isRequired,
};

const RemoteResourceTIPPTable = ({ resourceId, setBadgeCount, url }) => {
  const { data: { records: tipps = [] } = {} } = useQuery(
    ['GOKB', 'fetchTIPPS', resourceId],
    () => baseKy
      .get(
        `${url}?componentType=TIPP&title=${resourceId}&status=Current&max=10000`
      )
      .json(),
    {
      enabled: !!resourceId,
      onSuccess: (data) => {
        const count = Array.isArray(data?.records)
          ? data?.records.length
          : (data?.count ?? 0);
        setBadgeCount(count);
      },
      onError: () => {
        setBadgeCount(0);
      },
    }
  );

  return <GokbTIPPTable tipps={tipps} />;
};

RemoteResourceTIPPTable.propTypes = propTypes;

export default RemoteResourceTIPPTable;
