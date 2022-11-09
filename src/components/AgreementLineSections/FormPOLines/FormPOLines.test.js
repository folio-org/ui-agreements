import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import {
  TestForm,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import { line, initialValues } from './testResources';
import FormPOLines from './FormPOLines';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../POLinesFieldArray', () => () => <div>POLinesFieldArray</div>);
const onSubmit = jest.fn();

describe('renders FormPOLines', () => {
  describe('with no initialValues', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormPOLines line={line} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the PO lines accordion', async () => {
      await Accordion('PO lines').exists();
    });

    test('renders the POLinesFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLinesFieldArray')).toBeInTheDocument();
    });
  });

  describe('with initialValues', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormPOLines />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the PO lines accordion', async () => {
      await Accordion('PO lines').exists();
    });

    test('renders the POLinesFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLinesFieldArray')).toBeInTheDocument();
    });
  });
});
