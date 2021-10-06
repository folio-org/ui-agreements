import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import data from './testResources';
import translationsProperties from '../../../../test/helpers';
import PlatformUrlCustomization from './PlatformUrlCustomization';

describe('PlatformUrlCustomization', () => {
  beforeEach(() => {
    renderWithIntl(
      <PlatformUrlCustomization handlers={data.handlers} platform={data.platform} stringTemplates={data.stringTemplates} />,
      translationsProperties
    );
  });
  test('renders the PlatformUrlCustomization Accordion', async () => {
    await Accordion('Platform URL customization settings').exists();
  });
});
