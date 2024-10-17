
import { renderWithIntl } from '@folio/stripes-erm-testing';
import IfAccordionIsVisible from './IfAccordionIsVisible';

const name = 'usageData';

jest.mock('../../hooks', () => ({
  useAgreementsSettings: jest.fn()
    .mockReturnValueOnce({ parsedSettings: { hideAccordions: { usageData: true } } })
    .mockReturnValueOnce({ parsedSettings: { hideAccordions: { usageData: false } } })
    .mockReturnValueOnce({ parsedSettings: { hideAccordions: { usageData: true } } })
    .mockReturnValueOnce({ parsedSettings: { hideAccordions: { usageData: false } } })

}));

describe('IfAccordionIsVisible', () => {
  test('should not render children when hide usageData accordion set to true', () => {
    const { queryByText } = renderWithIntl(
      <IfAccordionIsVisible {...{ name }}>
        <div>Child</div>
      </IfAccordionIsVisible>
    );

    expect(queryByText('Child')).not.toBeInTheDocument();
  });

  test('should render children when hide usageData accordion set to false', () => {
    const { queryByText } = renderWithIntl(
      <IfAccordionIsVisible {...{ name }}>
        <div>Child</div>
      </IfAccordionIsVisible>
    );

    expect(queryByText('Child')).toBeInTheDocument();
  });

  test('should not render children passed as a function when hide usageData accordion set to true', () => {
    const { queryByText } = renderWithIntl(
      <IfAccordionIsVisible {...{ name }}>
        {({ isEnabled }) => (isEnabled ? (<div>Child</div>) : null)}
      </IfAccordionIsVisible>
    );

    expect(queryByText('Child')).not.toBeInTheDocument();
  });

  test('should render children passed as a function when hide usageData accordion set to false', () => {
    const { queryByText } = renderWithIntl(
      <IfAccordionIsVisible {...{ name }}>
        {({ isEnabled }) => (isEnabled ? (<div>Child</div>) : null)}
      </IfAccordionIsVisible>
    );

    expect(queryByText('Child')).toBeInTheDocument();
  });
});
