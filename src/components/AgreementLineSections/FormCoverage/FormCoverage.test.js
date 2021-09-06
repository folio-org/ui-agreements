import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion, KeyValue } from '@folio/stripes-testing';
import FormCoverage from './FormCoverage';
import { data, line, values, resource, initialValuesData, handlers, initialValues } from './testResources';
import translationsProperties from '../../../../test/helpers';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  SerialCoverage: () => <div>SerialCoverage</div>,
}));
jest.mock('../../CoverageFieldArray', () => () => <div>CoverageFieldArray</div>);

const onSubmit = jest.fn();

  describe('FormCoverage', () => {
    let renderComponent;
    describe('with no initialValues', () => {
      beforeEach(() => {
        renderComponent = renderWithIntl(
          <TestForm onSubmit={onSubmit}>
            <FormCoverage
              data={data}
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
      test('renders the expected  value', async () => {
        await KeyValue('Default coverage').exists();
      });
      test('renders the SerialCoverage component', () => {
        const { getByText } = renderComponent;
        expect(getByText('SerialCoverage')).toBeInTheDocument();
      });
    });

    describe('with initialValues', () => {
      beforeEach(() => {
        renderComponent = renderWithIntl(
          <TestForm initialValues={initialValues} onSubmit={onSubmit}>
            <FormCoverage
              data={initialValuesData}
              handlers={handlers}
              resource={resource}
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
  });
