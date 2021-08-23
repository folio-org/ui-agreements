import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import FormPOLines from './FormPOLines';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../POLinesFieldArray', () => () => <div>POLinesFieldArray</div>);
const onSubmit = jest.fn();
const data = {
    'addButtonTooltipId': 'ui-agreements.agreementLine.addCustomCoverageTootlip',
    'agreementLineSource': 'basket',
    'basket': [],
    'isSuppressFromDiscoveryEnabled': 'ƒ () {}',
    'line': {},
    'lineId': '',
    'resource': {},
    'setFieldData': 'ƒ () {}',
    'values': {}
  };

  describe('FormLines', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormPOLines data={data} />
        </TestForm>, translationsProperties
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
