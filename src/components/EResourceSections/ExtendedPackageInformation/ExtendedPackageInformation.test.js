
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { KeyValue, MultiColumnList } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import ExtendedPackageInformation from './ExtendedPackageInformation';

import eresource from './testResources';

describe('ExtendedPackageInformation', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <ExtendedPackageInformation
          eresource={eresource}
          id="extendedPackageInformation"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected Description', async () => {
    await KeyValue('Description').has({ value: 'a package description' });
  });

  test('renders the alternate names MCL', async () => {
    await MultiColumnList('alternate-resource-names-list').exists();
  });

  test('renders the package description urls MCL', async () => {
    await MultiColumnList('package-description-urls-list').exists();
  });
});
