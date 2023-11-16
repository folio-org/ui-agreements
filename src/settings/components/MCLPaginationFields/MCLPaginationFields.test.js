import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, TextField, renderWithIntl, TestForm } from '@folio/stripes-erm-testing';

import MCLPaginationFields from './MCLPaginationFields';

import { defaultMclPageSize } from '../../../constants';


const onSubmit = jest.fn();
const mclList = Object.keys(defaultMclPageSize.pageSize);

describe('MCLPaginationFields', () => {
  test('renders mcl fields', async () => {
    renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>
    );

    for (const mcl of mclList) {
      await TextField({ id: `${mcl}-page-size-id` }).exists();
    }
  });

  it('submitted expected payload', async () => {
    renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>
    );

    await waitFor(async () => {
      for (const mcl of mclList) {
        await TextField({ id: `${mcl}-page-size-id` }).fillIn('15');
      }
    });

    await Button('Submit').exists();
    await waitFor(async () => {
      await Button('Submit').click();
    });

    expect(onSubmit.mock.calls.length).toBe(1);

    const expectedPayload = {
      pageSize: {
        agreementEresources: 15,
        agreementLines: 15,
        entitlementOptions: 15,
        entitlements: 15,
        packageContents: 15
      }
    };

    expect(onSubmit.mock.calls[0][0]).toEqual(expectedPayload);
  });
});
