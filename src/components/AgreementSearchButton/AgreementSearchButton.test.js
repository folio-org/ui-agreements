import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import AgreementSearchButton from './AgreementSearchButton';
import translationsProperties from '../../../test/helpers';

describe('AgreementSearchButton', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <AgreementSearchButton
          disabled={false}
          name="agreement"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the expected text', () => {
    const { getByText } = renderComponent;
    expect(getByText('No agreement plugin')).toBeInTheDocument();
  });
});
