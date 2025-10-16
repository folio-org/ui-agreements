import { renderWithIntl } from '@folio/stripes-erm-testing';
import TitleCardExternal from './TitleCardExternal';
import { BASKET_TYPE_GOKB_TITLE, GOKB_RESOURCE_AUTHORITY } from '../../constants';

jest.mock('./EholdingsTitleCard', () => () => <div>EholdingsTitleCard</div>);
jest.mock('./GokbTitleCard', () => () => <div>GokbTitleCard</div>);

describe('TitleCardExternal', () => {
  const headerEnd = <div>header</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders EholdingsTitleCard for non-GOKB titles', () => {
    const title = { type: 'external' };

    const { getByText, queryByText } = renderWithIntl(
      <TitleCardExternal headerEnd={headerEnd} title={title} />
    );

    expect(getByText('EholdingsTitleCard')).toBeInTheDocument();
    expect(queryByText('GokbTitleCard')).not.toBeInTheDocument();
  });

  test('renders GokbTitleCard when type is BASKET_TYPE_GOKB_TITLE', () => {
    const title = { type: BASKET_TYPE_GOKB_TITLE };

    const { getByText, queryByText } = renderWithIntl(
      <TitleCardExternal headerEnd={headerEnd} title={title} />
    );

    expect(getByText('GokbTitleCard')).toBeInTheDocument();
    expect(queryByText('EholdingsTitleCard')).not.toBeInTheDocument();
  });

  test('renders GokbTitleCard when authority is GOKB_RESOURCE_AUTHORITY', () => {
    const title = { authority: GOKB_RESOURCE_AUTHORITY };

    const { getByText, queryByText } = renderWithIntl(
      <TitleCardExternal headerEnd={headerEnd} title={title} />
    );

    expect(getByText('GokbTitleCard')).toBeInTheDocument();
    expect(queryByText('EholdingsTitleCard')).not.toBeInTheDocument();
  });
});
