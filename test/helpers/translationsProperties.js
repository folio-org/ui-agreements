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
      'button.save': 'Save',
    }
  },
  {
    prefix: 'stripes-components',
    translations: {
      'saveAndClose': 'Save and close',
      'cancel': 'Cancel',
      'paneMenuActionsToggleLabel': 'Actions',
      'collapseAll': 'Collapse all',
      'button.edit': 'Edit'
    },
  },
  {
    prefix: 'stripes-smart-components',
    translations: {
      'permissionError': 'Sorry - your permissions do not allow access to this page.',
      'searchAndFilter': 'Search and filter',
      'hideSearchPane': 'Hide search pane',
      'search': 'Search',
      'resetAll': 'Reset all',
      'searchResultsCountHeader': '"{count, number} {count, plural, one {record found} other {records found}}"',
      'new': 'New'
    },
  }
];

export default translationsProperties;
