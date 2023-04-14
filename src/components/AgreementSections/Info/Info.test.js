
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { KeyValue, MultiColumnList, MultiColumnListCell } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import agreement from './testResources';
import Info from './Info';

jest.mock('../InfoPeriods', () => () => <div>InfoPeriods</div>);

let renderComponent;

describe('Info', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Info
        agreement={agreement}
        id="info"
      />,
      translationsProperties
    );
  });

  test('renders the agreement name', async () => {
    const { getByText } = renderComponent;
    expect(getByText('AM ag 1')).toBeInTheDocument();
  });

  test('renders the expected isPerpetual value', async () => {
    await KeyValue('Is perpetual').has({ value: 'Yes' });
  });

  test('renders the expected Renewal priority value', async () => {
    await KeyValue('Renewal priority').has({ value: 'Definitely renew' });
  });

  test('renders the expected Content type', async () => {
    await KeyValue('Content type').has({ value: 'Database; Books' });
  });

  test('renders the expected Description', async () => {
    await KeyValue('Description').has({ value: 'test desc 1' });
  });

  test('renders the alternate names MCL', async () => {
    await MultiColumnList('alternate-names-list').exists();
  });

  test('renders expected alternate name in each row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'alternatename1' }),
      await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'alternatename2' })
    ]);
  });

  test('renders the InfoPeriods components', () => {
    const { getByText } = renderComponent;
    expect(getByText('InfoPeriods')).toBeInTheDocument();
  });
});
