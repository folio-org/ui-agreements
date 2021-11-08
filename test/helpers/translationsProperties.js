import translations from '../../translations/ui-agreements/en';

const translationsProperties = [
  {
    prefix: 'ui-agreements',
    translations,
  },
  {
    prefix: 'stripes-core',
    translations: {
      'label.missingRequiredField': 'Please fill this in to continue',
    }
  },
  {
    prefix: 'stripes-components',
    translations: {
      'saveAndClose': 'Save and close',
      'cancel': 'Cancel',
      'paneMenuActionsToggleLabel': 'Actions'
    },
  },
  {
    prefix: 'stripes-smart-components',
    translations: {
      'permissionError': 'Sorry - your permissions do not allow access to this page.',
    },
  }
];

export default translationsProperties;
