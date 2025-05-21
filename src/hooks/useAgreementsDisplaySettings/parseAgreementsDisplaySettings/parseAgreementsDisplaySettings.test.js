import parseAgreementDisplaySettings from './parseAgreementsDisplaySettings';

describe('parseAgreementDisplaySettings', () => {
  test('returns default values when input is undefined', () => {
    const result = parseAgreementDisplaySettings();
    expect(result).toEqual({
      displaySuppressFromDiscovery: {},
      hideAccordions: {},
      hideEResourcesFunctionality: false,
      pageSize: {},
    });
  });

  test('parses boolean values correctly', () => {
    const input = [
      { key: 'hideeresourcesfunctionality', value: 'true', settingType: 'Boolean' },
      { key: 'hideaccordions_notes', value: 'false', settingType: 'Boolean' },
    ];

    const result = parseAgreementDisplaySettings(input);
    expect(result.hideEResourcesFunctionality).toBe(true);
    expect(result.hideAccordions.notes).toBe(false);
  });

  test('parses integer values correctly', () => {
    const input = [
      { key: 'pagesize_eresources', value: '25', settingType: 'Integer' },
    ];

    const result = parseAgreementDisplaySettings(input);
    expect(result.pageSize.eresources).toBe(25);
  });

  test('parses string values correctly', () => {
    const input = [
      { key: 'displaysuppressfromdiscovery_agreementLines', value: 'maybe', settingType: 'String' },
    ];

    const result = parseAgreementDisplaySettings(input);
    expect(result.displaySuppressFromDiscovery.agreementLines).toBe('maybe');
  });

  test('parses camelCase keys correctly', () => {
    const input = [
      { key: 'hideaccordions_foo_bar', value: 'true', settingType: 'Boolean' },
    ];

    const result = parseAgreementDisplaySettings(input);
    expect(result.hideAccordions.fooBar).toBe(true);
  });

  test('handles unknown keys gracefully', () => {
    const input = [
      { key: 'someunknownkey', value: '123', settingType: 'Integer' },
    ];

    const result = parseAgreementDisplaySettings(input);
    expect(result).toEqual({
      displaySuppressFromDiscovery: {},
      hideAccordions: {},
      hideEResourcesFunctionality: false,
      pageSize: {},
    });
  });
});
