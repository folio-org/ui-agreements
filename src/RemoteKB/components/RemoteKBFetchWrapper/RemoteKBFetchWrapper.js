import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import baseKy from 'ky';

const propTypes = {
  endpoints: PropTypes.string.isRequired,
};

const RemoteKBFetchWrapper = ({ id, endpoint, children }) => {
  const { data } = useQuery(['RemoteKBFetchWrapper', id], () => baseKy.get({ endpoint }).json());

  return children(data);
};

RemoteKBFetchWrapper.propTypes = propTypes;

export default RemoteKBFetchWrapper;
