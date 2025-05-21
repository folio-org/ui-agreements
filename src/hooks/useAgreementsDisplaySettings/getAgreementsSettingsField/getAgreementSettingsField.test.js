import getAgreementsSettingsField from './getAgreementsSettingsField';

import {
  DISPLAY_SUPPRESS_FROM_DISCOVERY,
  HIDE_ACCORDIONS,
  PAGE_SIZE,
  HIDE_ERESOURCES_FUNCTIONALITY
} from './constants';

describe('getAgreementsSettingsField', () => {
  test('returns correct path for displaySuppressFromDiscovery keys', () => {
    expect(getAgreementsSettingsField(`${DISPLAY_SUPPRESS_FROM_DISCOVERY}agreement_lines`))
      .toBe('displaySuppressFromDiscovery.agreementLines');
    expect(getAgreementsSettingsField(`${DISPLAY_SUPPRESS_FROM_DISCOVERY}notes`))
      .toBe('displaySuppressFromDiscovery.notes');
  });

  test('returns correct path for hideAccordions keys', () => {
    expect(getAgreementsSettingsField(`${HIDE_ACCORDIONS}e_resources`))
      .toBe('hideAccordions.eResources');
    expect(getAgreementsSettingsField(`${HIDE_ACCORDIONS}notes`))
      .toBe('hideAccordions.notes');
  });

  test('returns correct path for pageSize keys', () => {
    expect(getAgreementsSettingsField(`${PAGE_SIZE}agreement_lines`))
      .toBe('pageSize.agreementLines');
    expect(getAgreementsSettingsField(`${PAGE_SIZE}eresources`))
      .toBe('pageSize.eresources');
  });

  test('returns correct path for hideEResourcesFunctionality key', () => {
    expect(getAgreementsSettingsField(HIDE_ERESOURCES_FUNCTIONALITY))
      .toBe('hideEResourcesFunctionality');
  });

  test('returns null for unknown keys', () => {
    expect(getAgreementsSettingsField('some_unknown_key')).toBeNull();
    expect(getAgreementsSettingsField('anotherkey')).toBeNull();
  });

  test('handles empty string key', () => {
    expect(getAgreementsSettingsField('')).toBeNull();
  });
});
