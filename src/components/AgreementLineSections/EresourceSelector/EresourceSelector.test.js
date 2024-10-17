
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { FormattedMessage } from 'react-intl';
import translationsProperties from '../../../../test/helpers';
import EresourceSelector from './EresourceSelector';

const line = {
  component: () => {},
  error: '<Memo />',
  name: 'linkedResource',
  onAdd: () => {},
  value: ''
};

describe('EresourceSelector', () => {
  describe('renders EresourceSelector component', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <EresourceSelector line={line} />,
        translationsProperties
      );
    });

    test('renders eholdings card component', () => {
      const { getByText } = renderComponent;
      expect(getByText('eHoldings')).toBeInTheDocument();
    });

    test('renders linkEresourceToStart message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link an e-resource to get started')).toBeInTheDocument();
    });

    test('renders noEresourceLinked message', () => {
      const { getByText } = renderComponent;
      expect(getByText('No e-resource added')).toBeInTheDocument();
    });
  });

  describe('renders EresourceSelector with error message', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <EresourceSelector error={<FormattedMessage id="ui-agreements.agreementLine.provideEresource" />} />,
        translationsProperties
      );
    });

    test('renders error message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Please provide an e-resource or description to continue')).toBeInTheDocument();
    });
  });
});
