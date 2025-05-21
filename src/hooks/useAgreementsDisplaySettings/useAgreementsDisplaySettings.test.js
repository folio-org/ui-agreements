import { MemoryRouter } from 'react-router-dom';
import { invalidateQueries, setQueriesData } from 'react-query'; // We have special mocks for these already in erm-testing, so we can tweak directly, no need for spy


import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl } from '@folio/stripes-erm-testing';

import { useSettingSection } from '@k-int/stripes-kint-components';

import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';
import translationsProperties from '../../../test/helpers';

// Only mock what's not already mocked globally
jest.mock('./parseAgreementsDisplaySettings', () => () => ({
  hideAccordions: { notes: true },
  pageSize: { resources: 25 }
}));

const HookConsumer = ({ children }) => {
  const result = useAgreementsDisplaySettings({ namespaceAppend: ['GeneralSettings'] });
  return children(result);
};

let hookResult;
describe('useAgreementsDisplaySettings', () => {
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useSettingSection.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      settings: [
        { key: 'hideaccordions_notes', value: 'true', settingType: 'Boolean' },
        { key: 'pagesize_resources', value: '25', settingType: 'Integer' }
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
      hideAccordions: { notes: true },
      pageSize: { resources: 25 }
    });
  });

  describe('submitting values', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await hookResult.submitDisplaySettings({
          hideAccordions: { notes: false }, // this is the change
          pageSize: { resources: 25 }       // this is unchanged
        });
      });
    });

    it('called handleSubmit once', () => {
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('called handleSubmit with expected values', () => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        key: 'hideaccordions_notes',
        value: 'false',
        settingType: 'Boolean'
      });
    });

    it('called invalidateQueries with expected values', () => {
      expect(invalidateQueries).toHaveBeenCalledWith(['ERM', 'Settings', 'displaySettings']);
    });

    let setQueriesDataCall;
    describe('setQueriesData optimistic update', () => {
      beforeEach(() => {
        setQueriesDataCall = setQueriesData.mock.calls[0];
      });

      it('called setQueriesData once', () => {
        expect(setQueriesData).toHaveBeenCalledTimes(1);
      });

      it('called setQueriesData with expected key parameter', () => {
        expect(setQueriesDataCall[0]).toEqual(['ERM', 'Settings', 'displaySettings']);
      });

      it('called setQueriesData with expected function parameter', () => {
        const theFunc = setQueriesDataCall[1];
        expect(theFunc(['testing'])).toEqual([{ key: 'hideaccordions_notes', settingType: 'Boolean', value: 'false' }]);
      });
    });
  });
});
