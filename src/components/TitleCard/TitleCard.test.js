import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import TitleCard from './TitleCard';
import { serialTitleWithRelatedTitles } from './testResources';

jest.mock('./TitleCardInfo', () => () => <div>TitleCardInfo</div>);

let renderComponent;
describe('TitleCard', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TitleCard
            title={serialTitleWithRelatedTitles}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders TitleCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('titleCard')).toBeInTheDocument();
    });

    test('renders a link with the title name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: '19th century music' })).toBeInTheDocument();
    });

    test('renders the TitleCardInfo', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCardInfo')).toBeInTheDocument();
    });
  });
});
