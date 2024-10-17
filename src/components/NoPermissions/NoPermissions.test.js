
import { renderWithIntl } from '@folio/stripes-erm-testing';
import NoPermissions from './NoPermissions';
import translationsProperties from '../../../test/helpers';

describe('NoPermissions', () => {
  test('renders Permission Error message', () => {
    const { getByRole, getByText } = renderWithIntl(
      <NoPermissions />, translationsProperties
    );
    expect(getByRole('heading', { name: 'Sorry - your permissions do not allow access to this page.' })).toBeInTheDocument();
    expect(getByText('stripes-smart-components.permissionsDoNotAllowAccess')).toBeInTheDocument();
  });
});
