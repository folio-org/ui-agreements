import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';

import { Button, TextField } from '@folio/stripes-testing';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import MCLPaginationFields from './MCLPaginationFields';

import { defaultMclPageSize } from '../../../constants';

import { screen } from '@testing-library/dom';


const onSubmit = jest.fn();
const mclList = Object.keys(defaultMclPageSize.pageSize);


describe('MCLPaginationFields', () => {
  test('renders mcl fields', () => {
    const { getByTestId } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>
    );
    mclList.forEach(async (mcl) => {
      //expect(getByTestId(`${mcl}-page-size`)).toBeInTheDocument();
      const textField = TextField({ id: `${mcl}-page-size-id` });
      expect(await textField.exists());
    });
  });

  it('submitted expected payload', async () => {
    const { getByTestId } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>
    );

    mclList.forEach(async (mcl) => {
      const textField = TextField({ id: `${mcl}-page-size-id` });
      await textField.fillIn('15'.toString());
      //userEvent.type(getByTestId(`${mcl}-page-size`), '15');
    });

    await Button("Submit").exists();
    await Button("Submit").click();

    await expect(onSubmit.mock.calls.length).toBe(1);

    const expectedPayload = {
      'pageSize':{
        'agreementEresources':15,
        'agreementLines':15,
        'entitlementOptions':15,
        'entitlements':15,
        'packageContents':15
      }
    };

    expect(onSubmit.mock.calls[0][0]).toEqual(expectedPayload);
  });
});
