import { MemoryRouter } from 'react-router-dom';
import { invalidateQueries, setQueriesData } from 'react-query';
import { waitFor, act } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Callout } from '@folio/stripes-erm-testing';
import { useSettingSection } from '@k-int/stripes-kint-components';

import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';
import translationsProperties from '../../../test/helpers';

jest.mock('./parseAgreementsDisplaySettings', () => () => ({
  pageSize: {
    entitlementOptions: 10,
    entitlements: 10
  },
  hideAccordions: {
    usageData: true
  }
}));

const HookConsumer = ({ children }) => {
  const result = useAgreementsDisplaySettings({ namespaceAppend: ['GeneralSettings'] });
  return children(result);
};

let hookResult;
describe('useAgreementsDisplaySettings', () => {
  const mockHandleSubmit = jest.fn().mockImplementation(async update => update);

  beforeEach(() => {
    jest.clearAllMocks();

    useSettingSection.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      settings: [
        { id: 'id-1', key: 'pagesize_entitlement_options', value: '10', settingType: 'Integer' },
        { id: 'id-2', key: 'pagesize_entitlements', value: '10', settingType: 'Integer' },
        { id: 'id-3', key: 'hideaccordions_usage_data', value: 'true', settingType: 'Boolean' }
      ]
    });

    renderWithIntl(
      <MemoryRouter>
        <HookConsumer>
          {result => {
            hookResult = result;
            return null;
          }}
        </HookConsumer>
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('contains expected parsedSettings', () => {
    expect(hookResult.parsedSettings).toEqual({
      pageSize: {
        entitlementOptions: 10,
        entitlements: 10
      },
      hideAccordions: {
        usageData: true
      }
    });
  });

  describe('submitting values successfully', () => {
    beforeEach(async () => {
      await act(async () => {
        await hookResult.submitDisplaySettings({
          pageSize: { entitlementOptions: 20, entitlements: 10 },
          hideAccordions: { usageData: false }
        });
      });
    });

    it('calls handleSubmit twice', () => {
      expect(mockHandleSubmit).toHaveBeenCalledTimes(2);
    });

    it('calls handleSubmit with expected values', () => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        id: 'id-1',
        key: 'pagesize_entitlement_options',
        settingType: 'Integer',
        value: '20'
      });
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        id: 'id-3',
        key: 'hideaccordions_usage_data',
        settingType: 'Boolean',
        value: 'false'
      });
    });

    it('calls invalidateQueries', () => {
      expect(invalidateQueries).toHaveBeenCalledWith(['ERM', 'Settings', 'displaySettings']);
    });

    it('calls setQueriesData with expected parameters', () => {
      expect(setQueriesData).toHaveBeenCalledTimes(1);
      const [key, updater] = setQueriesData.mock.calls[0];
      expect(key).toEqual(['ERM', 'Settings', 'displaySettings']);
      const updated = updater([
        { id: 'id-1', key: 'pagesize_entitlement_options', value: '10' },
        { id: 'id-2', key: 'pagesize_entitlements', value: '10' },
        { id: 'id-3', key: 'hideaccordions_usage_data', value: 'true' }
      ]);
      expect(updated).toEqual([
        { id: 'id-1', key: 'pagesize_entitlement_options', settingType: 'Integer', value: '20' },
        { id: 'id-2', key: 'pagesize_entitlements', value: '10' },
        { id: 'id-3', key: 'hideaccordions_usage_data', settingType: 'Boolean', value: 'false' }
      ]);
    });

    it('renders success callout for both updated settings', async () => {
      await waitFor(async () => {
        await Callout(
          /Setting .*E-resource view pane > Options for acquiring e-resource.* was updated to 20.*Setting .*Hide accordions in agreement edit view for Usage data.* was updated to false/
        ).exists();
      });
    });
  });

  describe('submitting with a failure', () => {
    beforeEach(async () => {
      mockHandleSubmit.mockRejectedValue(new Error('Submission failed'));
      await act(async () => {
        await hookResult.submitDisplaySettings({
          pageSize: { entitlementOptions: 20, entitlements: 10 },
          hideAccordions: { usageData: false }
        });
      });
    });

    it('calls handleSubmit', () => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('renders error callout for both failed updates', async () => {
      await waitFor(async () => {
        await Callout(
          /Setting .*E-resource view pane > Options for acquiring e-resource.* could not be updated.*Setting .*Hide accordions in agreement edit view for Usage data.* could not be updated/
        ).exists();
      });
    });
  });
});
