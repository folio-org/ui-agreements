
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Accordion, MultiColumnList, MultiColumnListCell, Button } from '@folio/stripes-erm-testing';

import data from './testResources';
import translationsProperties from '../../../../test/helpers';
import PlatformUrlCustomization from './PlatformUrlCustomization';

const onViewUrlCustomizer = jest.fn();

describe('PlatformUrlCustomization', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <PlatformUrlCustomization
        handlers={data.handlers}
        platform={data.platform}
        stringTemplates={data.stringTemplates}
      />,
      translationsProperties
    );
  });
  test('renders the PlatformUrlCustomization Accordion', async () => {
    await Accordion('Platform URL customization settings').exists();
  });

  test('renders the Lines list MCL', async () => {
    await MultiColumnList('url-customization').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 2 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'Customization code'] }).exists();
  });

  test('renders expected name and customization code in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'Test' }),
      await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: '2222' })
    ]);
  });

  test('renders the Platform URL customization settings button', async () => {
    await Button('Platform URL customization settings').exists();
  });

  test('renders maximum number of URL customization message  ', () => {
    const { getByText } = renderComponent;
    expect(getByText('Maximum number of URL customizations is 1')).toBeInTheDocument();
  });

  describe('Clicking the row', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await MultiColumnList('url-customization').click({ row: 0, columnIndex: 0 });
      });
    });

    test('should not call the onViewUrlCustomizer callback', () => {
      expect(onViewUrlCustomizer).not.toHaveBeenCalled();
    });
  });
});
