import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion, KeyValue } from '@folio/stripes-testing';
import FormCoverage from './FormCoverage';
import { line, values, resource, handlers, initialValues, emptyCoverage, basketData } from './testResources';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../CoverageFieldArray', () => () => <div>CoverageFieldArray</div>);
jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  SerialCoverage: () => <div>SerialCoverage</div>,
}));

const onSubmit = jest.fn();

describe('FormCoverage', () => {
  let renderComponent;
  describe('with no initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormCoverage
            line={line}
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

    test('renders the expected Default coverage value', async () => {
      await KeyValue('Default coverage').has({ value: 'SerialCoverage' });
    });

    test('renders the SerialCoverage component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SerialCoverage')).toBeInTheDocument();
    });

    test('renders the expected embargo value', async () => {
      await KeyValue('Embargo').has({ value: 'Moving wall end: 4 years' });
    });
  });

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
  });

  describe('with no coverage', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormCoverage
            line={{}}
            resource={{}}
            values={{}}
          />
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

  describe('with no coverage', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormCoverage
            line={basketData.line}
            resource={basketData.resource}
            values={basketData.values}
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
