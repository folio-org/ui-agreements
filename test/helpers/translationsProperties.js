import { translationsProperties as coreTranslations } from '@folio/stripes-erm-testing';
import translations from '../../translations/ui-agreements/en';


const translationsProperties = [
  {
    prefix: 'ui-agreements',
    translations,
  },
  ...coreTranslations
];

export default translationsProperties;
