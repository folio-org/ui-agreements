import PropTypes from 'prop-types';

import { hiddenAccordions } from '../../constants';
import { useAgreementsSettings } from '../../hooks';

const hiddenAccordionsNames = Object.keys(hiddenAccordions);

const IfAccordionIsVisible = ({ children, name }) => {
  const settings = useAgreementsSettings();

  const isHidden = settings?.parsedSettings.hideAccordions?.[name] || false;
  const isEnabled = !isHidden; // This takes advantage of truthiness to also make sure the path above exists

  if (typeof children === 'function') {
    return children({ isEnabled });
  }

  return isEnabled ? children : null;
};

IfAccordionIsVisible.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  name: PropTypes.oneOf(hiddenAccordionsNames).isRequired,
};

export default IfAccordionIsVisible;
