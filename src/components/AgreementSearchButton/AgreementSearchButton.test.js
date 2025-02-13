import { useRef as mockUseRef } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Pluggable } from '@folio/stripes/core';
import {
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import AgreementSearchButton from './AgreementSearchButton';
import translationsProperties from '../../../test/helpers';

const mockOnClick = jest.fn();
const mockOnAgreementSelected = jest.fn();

const MockPluggable = ({ children, renderTrigger }) => {
  const buttonRef = mockUseRef();
  return (
    <>
      {renderTrigger({
        buttonRef,
        onClick: mockOnClick,
        id: 'test-id'
      })}
      {children}
    </>
  );
};
Pluggable.mockImplementation(MockPluggable);
describe('AgreementSearchButton', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <AgreementSearchButton
          buttonProps={{ id: 'test-button' }}
          disabled
          name="agreement"
          onAgreementSelected={mockOnAgreementSelected}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the button as disabled when the disabled prop is true', () => {
    const { getByRole } = renderComponent;
    const button = getByRole('button', { name: /select agreement/i });

    expect(button).toBeDisabled();
  });

  it('renders the fallback message when no plugin is available', () => {
    const { getByText } = renderComponent;
    expect(getByText('No agreement plugin')).toBeInTheDocument();
  });
});
