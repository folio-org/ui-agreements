

import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import TitleFormInfo from './TitleFormInfo';

const onSubmit = jest.fn();
const isSuppressFromDiscoveryEnabled = jest.fn(_title => true);
const isSuppressFromDiscoveryDisabled = jest.fn(_title => false);

const suppressFromDiscoveryTrue = {
  'suppressFromDiscovery': true,
};

const suppressFromDiscoveryFalse = {
  'suppressFromDiscovery': false,
};


describe('TitleFormInfo', () => {
  describe('with suppressFromDiscovery as true', () => {
    beforeEach(() => renderWithIntl(
      <TestForm initialValues={suppressFromDiscoveryTrue} onSubmit={onSubmit}>
        <TitleFormInfo isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled} />
      </TestForm>,
      translationsProperties
    ));

    test('renders the Suppress from discovery Checkbox', async () => {
      await Checkbox({ id: 'title-suppress-from-discovery' }).exists();
    });

    test('renders suppress from discovery checkbox as checked', async () => {
      await Checkbox({ id: 'title-suppress-from-discovery' }).is({ checked: true });
    });
  });

  describe('with suppressFromDiscovery as false', () => {
    beforeEach(() => renderWithIntl(
      <TestForm initialValues={suppressFromDiscoveryFalse} onSubmit={onSubmit}>
        <TitleFormInfo isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled} />
      </TestForm>,
      translationsProperties
    ));

    test('renders the Suppress from discovery Checkbox', async () => {
      await Checkbox({ id: 'title-suppress-from-discovery' }).exists();
    });

    test('renders suppress from discovery checkbox as unchecked', async () => {
      await Checkbox({ id: 'title-suppress-from-discovery' }).is({ checked: false });
    });
  });

  describe('with isSuppressFromDiscovery not true for title', () => {
    let renderedComponent;
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <TitleFormInfo isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryDisabled} />,
        translationsProperties
      );
    });

    test('Does not render the component', () => {
      const { container } = renderedComponent;
      expect(container.firstChild).toBeNull();
    });
  });
});
