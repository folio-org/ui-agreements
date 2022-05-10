import { defaultMclPageSize } from '../../constants';

export default function parseMclPageSize(settings, mcl) {
  return settings?.parsedSettings?.pageSize?.[mcl] ?? defaultMclPageSize?.pageSize?.[mcl];
}
