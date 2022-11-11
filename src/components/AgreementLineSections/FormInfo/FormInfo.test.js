
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Datepicker, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import FormInfo from './FormInfo';
import { data, handlers, initialValues, values } from './testResources';

const onSubmit = jest.fn();
const isSuppressFromDiscoveryEnabled = jest.fn(_info => true);

let renderComponent;
describe('FormInfo', () => {
  describe('with no initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm data={data} onSubmit={onSubmit}>
          <FormInfo
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
          />
        </TestForm>, translationsProperties
      );
    });

    test('renders Description field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Description' }));
    });

    test('renders Note field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Note' }));
    });

    test('renders Active from Datepicker', async () => {
      await Datepicker({ id: 'agreement-line-active-from' }).exists();
    });

    test('renders Active to Datepicker', async () => {
      await Datepicker({ id: 'agreement-line-active-to' }).exists();
    });

    test('renders Suppress from discovery Checkbox', async () => {
      await Checkbox({ id: 'agreement-line-suppress-from-discovery' }).exists();
    });
  });

  describe('with initial values', () => {
    beforeEach(() => {
      renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormInfo data={data} handlers={handlers} isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled} values={values} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the expected value in the Description field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Description' })).toHaveDisplayValue('This is description');
    });

    test('renders the expected value in the Note field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Note' })).toHaveDisplayValue('This is note.');
    });

    test('renders the expected value in the Active from field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Active from' })).toHaveDisplayValue('08/04/2021');
    });

    test('renders the expected value in the Active to field', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('textbox', { name: 'Active to' })).toHaveDisplayValue('08/28/2021');
    });

    test('renders the expected value in the Suppress from discovery field', () => {
      expect(('checkbox', { name: 'Suppress from discovery' })).toBeTruthy();
    });
  });
});
