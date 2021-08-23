import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Datepicker, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import FormInfo from './FormInfo';

const onSubmit = jest.fn();
const isSuppressFromDiscoveryEnabled = jest.fn(_info => true);

const data = {
  'addButtonTooltipId': 'ui-agreements.agreementLine.addCustomCoverageTootlip',
  'agreementLineSource': 'basket',
  'basket': [],
  'isSuppressFromDiscoveryEnabled': 'ƒ () {}',
  'line': {},
  'lineId': '',
  'resource': {},
  'setFieldData': 'ƒ () {}',
  'values': {
    'description': 'This is description.',
    'note': 'This is note.',
    'activeFrom': '2021-08-04',
    'activeTo': '2021-08-28',
    'suppressFromDiscovery': true
  }
};

  let renderComponent;
  describe('FormInfo', () => {
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

      test('renders Active from field', () => {
        const { getByRole } = renderComponent;
        expect(getByRole('textbox', { name: 'Active from' }));
      });

      test('renders Active to field', () => {
        const { getByRole } = renderComponent;
        expect(getByRole('textbox', { name: 'Active to' }));
      });

      test('renders Suppress from discovery field', () => {
        const { getByRole } = renderComponent;
        expect(getByRole('checkbox', { name: 'Suppress from discovery' }));
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

      test('renders the  Description field by id', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('line-description')).toBeInTheDocument();
      });
    });
