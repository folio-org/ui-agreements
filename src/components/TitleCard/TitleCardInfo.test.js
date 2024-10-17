
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import TitleCardInfo from './TitleCardInfo';
import { monographTitle, serialTitleWithRelatedTitles } from './testResources';

jest.mock('./MonographResourceInfo', () => () => <div>MonographResourceInfo</div>);
jest.mock('./SerialResourceInfo', () => () => <div>SerialResourceInfo</div>);
jest.mock('../RelatedTitleInfo', () => () => <div>RelatedTitleInfo</div>);

let renderComponent;
describe('TitleCardInfo', () => {
  describe('with serial resource with related titles', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TitleCardInfo
            title={serialTitleWithRelatedTitles}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the SerialResourceInfo', () => {
      const { getByText } = renderComponent;
      expect(getByText('SerialResourceInfo')).toBeInTheDocument();
    });

    test('renders the RelatedTitleInfo', () => {
      const { getByText } = renderComponent;
      expect(getByText('RelatedTitleInfo')).toBeInTheDocument();
    });
  });

  describe('with monograph resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TitleCardInfo
            title={monographTitle}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the MonographResourceInfo', () => {
      const { getByText } = renderComponent;
      expect(getByText('MonographResourceInfo')).toBeInTheDocument();
    });
  });
});
