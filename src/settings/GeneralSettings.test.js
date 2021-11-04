import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import translationsProperties from '../../test/helpers';
import GeneralSettings from './GeneralSettings';

jest.mock('./GeneralSettingsForm', () => () => <div>GeneralSettingsForm</div>);

describe('GeneralSettings', () => {
    describe('rendering the GeneralSettings component', () => {
      let renderComponent;
      beforeEach(() => {
        renderComponent = renderWithIntl(
          <MemoryRouter>
            <GeneralSettings />
          </MemoryRouter>,
          translationsProperties
        );
      });

      test('renders GeneralSettingsForm component', () => {
        const { getByText } = renderComponent;
        expect(getByText('GeneralSettingsForm')).toBeInTheDocument();
      });

      test('renders ConfigManager component ', () => {
        screen.debug();
        const { getByText } = renderComponent;
        expect(getByText('ConfigManager')).toBeInTheDocument();
      });
    });
  });
