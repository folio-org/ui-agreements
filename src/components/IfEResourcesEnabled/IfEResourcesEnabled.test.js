import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import IfEResourcesEnabled from './IfEResourcesEnabled';

jest.mock('../../hooks', () => ({
  useAgreementsSettings: jest.fn()
    .mockReturnValueOnce({ parsedSettings: { hideEResourcesFunctionality: true } })
    .mockReturnValueOnce({ parsedSettings: { hideEResourcesFunctionality: false } })
    .mockReturnValueOnce({ parsedSettings: { hideEResourcesFunctionality: true } })
    .mockReturnValueOnce({ parsedSettings: { hideEResourcesFunctionality: false } })

}));

describe('IfEResourcesEnabled', () => {
  test('should not render children when internal kb set to true', () => {
    const { queryByText } = renderWithIntl(
      <IfEResourcesEnabled>
        <div>Child</div>
      </IfEResourcesEnabled>
    );

    expect(queryByText('Child')).not.toBeInTheDocument();
  });

  test('should not render children when hide internal kb set to false', () => {
    const { queryByText } = renderWithIntl(
      <IfEResourcesEnabled>
        <div>Child</div>
      </IfEResourcesEnabled>
    );

    expect(queryByText('Child')).toBeInTheDocument();
  });

  test('should not render children when internal kb set to true', () => {
    const { queryByText } = renderWithIntl(
      <IfEResourcesEnabled>
        {({ isEnabled }) => (isEnabled ? (<div>Child</div>) : null)}
      </IfEResourcesEnabled>
    );

    expect(queryByText('Child')).not.toBeInTheDocument();
  });

  test('should not render children passed as a function when hide internal kb set to false', () => {
    const { queryByText } = renderWithIntl(
      <IfEResourcesEnabled>
        {({ isEnabled }) => (isEnabled ? (<div>Child</div>) : null)}
      </IfEResourcesEnabled>
    );

    expect(queryByText('Child')).toBeInTheDocument();
  });
});
