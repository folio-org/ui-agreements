import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';

import * as ReactQuery from 'react-query';
import { useSettingSection } from '@k-int/stripes-kint-components';
import useAgreementsDisplaySettings from './useAgreementsDisplaySettings';
import parseAgreementDisplaySettings from '../components/utilities/parseAgreementDisplaySettings';


import translationsProperties from '../../test/helpers';

// Only mock the function we need to control
jest.mock('../components/utilities/parseAgreementDisplaySettings');

describe('useAgreementsDisplaySettings', () => {
  const mockInvalidateQueries = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    jest.spyOn(ReactQuery, 'useQueryClient').mockReturnValue({
      invalidateQueries: mockInvalidateQueries
    });

    parseAgreementDisplaySettings.mockReturnValue({
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

    await act(async () => {
      await hookResult.submitDisplaySettings({
        hideAccordions: { notes: false },
        pageSize: { resources: 25 }
      });
    });

    expect(mockHandleSubmit).toHaveBeenCalledWith({
      key: 'hideaccordions_notes',
      value: 'false',
      settingType: 'Boolean'
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith(['ERM', 'Settings', 'displaySettings']);
  });
});
