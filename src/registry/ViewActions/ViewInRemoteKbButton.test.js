import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import ViewInRemoteKbButton from './ViewInRemoteKbButton';

describe('ViewInRemoteKbButton', () => {
  const url = 'https://gokbt.gbv.de/gokb-ui/title/1234567890';
  const remoteKbName = 'GOKB';

  test('renders translated text and link', () => {
    const { getByText, getByRole } = renderWithIntl(
      <ViewInRemoteKbButton remoteKbName={remoteKbName} url={url} />,
      translationsProperties
    );

    expect(getByText('View title in GOKB')).toBeInTheDocument();

    const btn = getByRole('button', { name: 'View title in GOKB' });

    expect(btn.tagName.toLowerCase()).toBe('a');
    expect(btn).toHaveAttribute('href', 'https://gokbt.gbv.de/gokb-ui/title/1234567890');
  });
});
