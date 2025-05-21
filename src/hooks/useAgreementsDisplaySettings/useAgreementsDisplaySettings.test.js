import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as ReactQuery from 'react-query';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import { useSettingSection } from '@k-int/stripes-kint-components';

import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';
import parseAgreementsDisplaySettings from './parseAgreementsDisplaySettings';

import translationsProperties from '../../../test/helpers';

// Only mock what's not already mocked globally
jest.mock('./parseAgreementsDisplaySettings');

describe('useAgreementsDisplaySettings', () => {
  const mockInvalidateQueries = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    jest.spyOn(ReactQuery, 'useQueryClient').mockReturnValue({
      invalidateQueries: mockInvalidateQueries
    });

    parseAgreementsDisplaySettings.mockReturnValue({
      hideAccordions: { notes: true },
      pageSize: { resources: 25 }
    });

    useSettingSection.mockReturnValue({
      handleSubmit: mockHandleSubmit,
      settings: [
        { key: 'hideaccordions_notes', value: 'true', settingType: 'Boolean' },
        { key: 'pagesize_resources', value: '25', settingType: 'Integer' }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const HookConsumer = ({ children }) => {
    const result = useAgreementsDisplaySettings({ namespaceAppend: ['GeneralSettings'] });
    return children(result);
  };

  it('returns parsedSettings and submits changed values', async () => {
    let hookResult;

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

    expect(hookResult.parsedSettings).toEqual({
      hideAccordions: { notes: true },
      pageSize: { resources: 25 }
    });

    let resultPromise;

    await act(() => {
      resultPromise = hookResult.submitDisplaySettings({
        hideAccordions: { notes: false }, // this is the change
        pageSize: { resources: 25 }       // this is unchanged
      });

      return resultPromise;
    });

    await resultPromise;

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockHandleSubmit).toHaveBeenCalledWith({
      key: 'hideaccordions_notes',
      value: 'false',
      settingType: 'Boolean'
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith(['ERM', 'Settings', 'displaySettings']);
  });
});
