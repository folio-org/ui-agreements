import camelCase from 'lodash/camelCase';

import {
  DISPLAY_SUPPRESS_FROM_DISCOVERY,
  HIDE_ACCORDIONS,
  HIDE_ERESOURCES_FUNCTIONALITY,
  PAGE_SIZE
} from './constants';

// This logic repeated in parseAgreementsDisplaySettings and useAgreementsDisplaySettings,
// so separate it out. Finds a structured STRING representation of the expected form shape.
// In parseAgreementsDisplaySettings we use it to _set_, in useAgreementsDisplaySettings we use it to get
export default function getAgreementsSettingsField(key) {
  if (key.startsWith(DISPLAY_SUPPRESS_FROM_DISCOVERY)) {
    const subKey = camelCase(key.replace(DISPLAY_SUPPRESS_FROM_DISCOVERY, ''));
    return `displaySuppressFromDiscovery.${subKey}`;
  } else if (key.startsWith(HIDE_ACCORDIONS)) {
    const subKey = camelCase(key.replace(HIDE_ACCORDIONS, ''));
    return `hideAccordions.${subKey}`;
  } else if (key.startsWith(PAGE_SIZE)) {
    const subKey = camelCase(key.replace(PAGE_SIZE, ''));
    return `pageSize.${subKey}`;
  } else if (key === HIDE_ERESOURCES_FUNCTIONALITY) {
    return 'hideEResourcesFunctionality';
  }

  return null;
}
