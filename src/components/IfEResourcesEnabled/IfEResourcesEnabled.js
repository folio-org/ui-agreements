import PropTypes from 'prop-types';
import { useEresourcesEnabled } from '../../hooks';

const IfEResourcesEnabled = ({ children }) => {
  const isEnabled = useEresourcesEnabled();

  if (typeof children === 'function') {
    return children({ isEnabled });
  }

  return isEnabled ? children : null;
};

IfEResourcesEnabled.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default IfEResourcesEnabled;
