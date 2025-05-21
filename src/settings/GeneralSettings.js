import { FormattedMessage } from 'react-intl';
import GeneralSettingsForm from './GeneralSettingsForm';
import { useAgreementsDisplaySettings } from '../hooks';

const GeneralSettings = () => {
  const { parsedSettings, submitDisplaySettings } = useAgreementsDisplaySettings({ namespaceAppend: ['GeneralSettings'] });

  return (
    <GeneralSettingsForm
      initialValues={parsedSettings}
      label={<FormattedMessage id="ui-agreements.settings.displaySettings" />}
      onSubmit={submitDisplaySettings}
    />
  );
};

export default GeneralSettings;
