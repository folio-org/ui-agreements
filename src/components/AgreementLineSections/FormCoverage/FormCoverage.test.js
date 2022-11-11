
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, KeyValue } from '@folio/stripes-testing';
import FormCoverage from './FormCoverage';
import { values, resource, handlers, initialValues, externalData } from './testResources';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../CoverageFieldArray', () => () => <div>CoverageFieldArray</div>);

const onSubmit = jest.fn();

describe('FormCoverage', () => {
  let renderComponent;

  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormCoverage
            handlers={handlers}
            resource={resource}
            values={values}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the Coverage accordion', async () => {
      await Accordion('Coverage').exists();
    });

    test('renders the SerialCoverage component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SerialCoverage')).toBeInTheDocument();
    });

    test('renders the CoverageFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CoverageFieldArray')).toBeInTheDocument();
    });

    test('renders the Embargo component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Embargo')).toBeInTheDocument();
    });

    test('renders the expected embargo value', async () => {
      await KeyValue('Embargo').has({ value: 'Moving wall end: 4 years' });
    });

    test('renders the expected Default coverage value', async () => {
      await KeyValue('Default coverage').has({ value: 'SerialCoverage' });
    });
  });

  describe('with no initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormCoverage />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the Coverage accordion', async () => {
      await Accordion('Coverage').exists();
    });

    test('renders the CoverageFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CoverageFieldArray')).toBeInTheDocument();
    });
  });

  describe('with external type', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormCoverage
            line={externalData}
          />
        </TestForm>,
        translationsProperties
      );
    });
    test('does not render coverage Accordion', async () => {
      await Accordion('Coverage').absent();
    });
  });
});
