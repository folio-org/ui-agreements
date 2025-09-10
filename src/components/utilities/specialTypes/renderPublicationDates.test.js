import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import renderPublicationDates from './renderPublicationDates';
import translationsProperties from '../../../../test/helpers';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  FormattedUTCDate: ({ value }) => <span data-testid="utc">{value}</span>,
  Icon: ({ icon }) => <span data-testid="icon">{icon}</span>,
}));

// Helper to render the returned node (or null)
const renderNode = (resource) => renderWithIntl(
  <MemoryRouter>
    {renderPublicationDates(resource)}
  </MemoryRouter>,
  translationsProperties
);

describe('renderPublicationDates', () => {
  test('returns null when no date fields provided', () => {
    expect(renderPublicationDates({})).toBeNull();
  });

  test('renders dateFirstOnline only', () => {
    const { getAllByTestId, queryByTestId } = renderNode({ dateFirstOnline: '2020-01-01' });
    expect(getAllByTestId('utc')[0].textContent).toBe('2020-01-01');
    // No arrow icon when only online date is shown
    expect(queryByTestId('icon')).toBeNull();
  });

  test('renders dateFirstInPrint only', () => {
    const { getAllByTestId, queryByTestId } = renderNode({ dateFirstInPrint: '2010-01-01' });
    expect(getAllByTestId('utc')[0].textContent).toBe('2010-01-01');
    expect(queryByTestId('icon')).toBeNull();
  });

  test('renders coverage with both publishedFrom and publishedTo', () => {
    const { getAllByTestId, getByTestId, container } = renderNode({
      publishedFrom: '1904-01-01',
      publishedTo: '1920-12-31',
    });
    const values = getAllByTestId('utc').map(n => n.textContent);
    expect(values).toEqual(expect.arrayContaining(['1904-01-01', '1920-12-31']));
    expect(getByTestId('icon').textContent).toBe('arrow-right');
    expect(container.textContent).not.toContain('*');
  });

  test('renders coverage with only publishedFrom (right placeholder "*")', () => {
    const { getAllByTestId, getByTestId, container } = renderNode({
      publishedFrom: '2000-01-01',
    });
    expect(getAllByTestId('utc')[0].textContent).toBe('2000-01-01');
    expect(getByTestId('icon').textContent).toBe('arrow-right');
    expect(container.textContent).toContain('*');
  });

  test('renders coverage with only publishedTo (left placeholder "*")', () => {
    const { getAllByTestId, getByTestId, container } = renderNode({
      publishedTo: '2025-12-31',
    });
    expect(getAllByTestId('utc')[0].textContent).toBe('2025-12-31');
    expect(getByTestId('icon').textContent).toBe('arrow-right');
    expect(container.textContent).toContain('*');
  });
});
