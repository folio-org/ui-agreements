import PropTypes from 'prop-types';
import { useAgreementsSettings } from '../../hooks';

const IfEResourcesEnabled = ({ children }) => {
  const settings = useAgreementsSettings();

  const isHidden = settings?.parsedSettings?.hideEResourcesFunctionality;
  const isEnabled = !isHidden; // This takes advantage of truthiness to also make sure the path above exists

  if (typeof children === 'function') {
    return children({ isEnabled });
  }

  return isEnabled ? children : null;
};

IfEResourcesEnabled.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default IfEResourcesEnabled;
