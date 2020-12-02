import { defaultSettingsValues } from '../../constants';

export default function parseMclSettings(settings, name, mcl) {
  const parsedSettings = JSON.parse(settings?.records?.[0]?.value || '{}');
  return parsedSettings?.[name]?.[mcl] ?? defaultSettingsValues?.[name]?.[mcl];
}
