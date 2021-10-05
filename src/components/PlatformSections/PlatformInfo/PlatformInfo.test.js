import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { KeyValue } from '@folio/stripes-testing';
import data from './testResources';
import translationsProperties from '../../../../test/helpers';
import PlatformInfo from './PlatformInfo';

describe('PlatformInfo', () => {
  beforeEach(() => {
    renderWithIntl(
      <PlatformInfo platform={data.platform} />,
      translationsProperties
    );
  });

  test('renders the expected locators key value', async () => {
    await KeyValue('Locators').has({ value: 'msp.org' });
  });

  test('renders the expected local platform code key value', async () => {
    await KeyValue('Local platform code').has({ value: '-' });
  });
});

