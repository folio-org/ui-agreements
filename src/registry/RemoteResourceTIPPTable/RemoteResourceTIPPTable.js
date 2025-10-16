import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import baseKy from 'ky';
import GokbTIPPTable from '../Gokb/GokbTIPPTable';

const propTypes = {
  resourceId: PropTypes.string.isRequired,
};

const RemoteResourceTIPPTable = ({ resourceId }) => {
  const { data: { records: tipps = [] } = {} } = useQuery(
    ['GOKB', 'fetchTIPPS', resourceId],
    () => baseKy
      .get(
        `https://gokbt.gbv.de/gokb/api/find?componentType=TIPP&title=${resourceId}&status=Current&max=1000`
      )
      .json()
  );

  return <GokbTIPPTable tipps={tipps} />;
};

RemoteResourceTIPPTable.propTypes = propTypes;

export default RemoteResourceTIPPTable;
