
import { renderWithIntl } from '@folio/stripes-erm-testing';
import IfEResourcesEnabled from './IfEResourcesEnabled';

jest.mock('../../hooks', () => ({
  useEresourcesEnabled: jest.fn()
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)

}));

describe('IfEResourcesEnabled', () => {
  test('should not render children when hide internal kb set to true', () => {
    const { queryByText } = renderWithIntl(
      <IfEResourcesEnabled>
        <div>Child</div>
      </IfEResourcesEnabled>
    );

    expect(queryByText('Child')).not.toBeInTheDocument();
  });

  test('should render children when hide internal kb set to false', () => {
    const { queryByText } = renderWithIntl(
      <IfEResourcesEnabled>
        <div>Child</div>
      </IfEResourcesEnabled>
    );

    expect(queryByText('Child')).toBeInTheDocument();
  });

  test('should not render children passed as a function when hide internal kb set to true', () => {
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
