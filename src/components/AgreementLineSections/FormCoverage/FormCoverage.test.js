import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import FormCoverage from './FormCoverage';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../CoverageFieldArray', () => () => <div>CoverageFieldArray</div>);
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

  describe('FormCoverage', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormCoverage data={data} />
        </TestForm>, translationsProperties
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
