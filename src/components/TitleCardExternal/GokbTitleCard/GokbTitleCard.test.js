import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import GokbTitleCard from './GokbTitleCard';
import { agreementLineTitle, basketTitle } from './testResources';

jest.mock('../../EResourceLink', () => () => <div>EResourceLink</div>);

const cases = [
  ['with resource from basket', basketTitle],
  ['with resource from agreement line', agreementLineTitle],
];

describe('GokbTitleCard', () => {
  describe.each(cases)('%s', (_label, titleProp) => {
    let renderComponent;

    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <GokbTitleCard title={titleProp} />
        </Router>,
        translationsProperties
      );
    });

    test('renders GokbTitleCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('GokbTitleCard')).toBeInTheDocument();
    });

    test('renders EResourceLink component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EResourceLink')).toBeInTheDocument();
    });

    test('renders the expected GOKB package UUID', async () => {
      await KeyValue('GOKB package UUID').has({
        value: 'bc634143-36ed-4ae2-a991-5e35ae4fee6a',
      });
    });

    test('renders the expected GOKB title UUID', async () => {
      await KeyValue('GOKB title UUID').has({
        value: 'e2a8df5b-4d2c-4f65-82f4-fbd96f43538c',
      });
    });
  });
});
