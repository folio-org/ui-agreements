import { MemoryRouter } from 'react-router-dom';
import { mockKyJson } from '@folio/stripes/core';
import { renderWithIntl, Button as ButtonInteractor } from '@folio/stripes-erm-testing';
import { useQuery } from 'react-query';
import translationsProperties from '../../../test/helpers';

import ViewInLocalKbButton from './ViewInLocalKbButton';

jest.mock('react-query', () => {
  const actual = jest.requireActual('react-query');
  return { ...actual, useQuery: jest.fn() };
});

jest.mock('@folio/stripes/components', () => {
  const actual = jest.requireActual('@folio/stripes/components');
  return {
    ...actual,
    Icon: ({ icon, children }) => (
      <span data-icon={icon} data-testid="icon">{children}</span>
    ),
  };
});

const mockUseQueryWithArray = (arr) => {
  useQuery.mockImplementation((_key, fetcher, options) => {
    mockKyJson.mockResolvedValueOnce(arr);
    fetcher();
    const selected = options?.select ? options.select(arr) : undefined;
    return { data: selected, isLoading: false };
  });
};

describe('ViewInLocalKbButton', () => {
  const remoteId = '1234567890';

  test('disabled: shows text, disabled button, eye-closed icon when no local id', async () => {
    mockUseQueryWithArray([]);

    const { getByText, getByTestId, findByRole } = renderWithIntl(
      <MemoryRouter>
        <ViewInLocalKbButton remoteId={remoteId} />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getByText('View title in local KB')).toBeInTheDocument();

    await ButtonInteractor('View title in local KB').has({ disabled: true });
    const btn = await findByRole('button', { name: 'View title in local KB' });
    expect(btn.tagName.toLowerCase()).toBe('button');
    expect(btn).not.toHaveAttribute('href');

    expect(getByTestId('icon')).toHaveAttribute('data-icon', 'eye-closed');
  });

  test('enabled: shows text, link to local title, eye-open icon when id exists', async () => {
    const localId = 'abc-uuid-1';
    mockUseQueryWithArray([{ id: localId }]);

    const { getByText, getByTestId, findByRole } = renderWithIntl(
      <MemoryRouter>
        <ViewInLocalKbButton remoteId={remoteId} />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getByText('View title in local KB')).toBeInTheDocument();

    await ButtonInteractor('View title in local KB').has({ disabled: false });
    const btn = await findByRole('button', { name: 'View title in local KB' });
    expect(btn.tagName.toLowerCase()).toBe('a');
    expect(btn).toHaveAttribute('href', `/erm/titles/${localId}`);

    expect(getByTestId('icon')).toHaveAttribute('data-icon', 'eye-open');
  });
});

