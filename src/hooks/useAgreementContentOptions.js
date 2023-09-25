import { useIntl } from 'react-intl';

const useAgreementContentOptions = () => {
  const intl = useIntl();

  return [
    {
      value: 'alternateNames',
      label: intl.formatMessage({
        id: 'ui-agreements.alternativeNames',
      }),
    },
    {
      value: 'agreementContentTypes',
      label: intl.formatMessage({
        id: 'ui-agreements.agreements.contentTypes',
      }),
    },
    {
      value: 'contacts',
      label: intl.formatMessage({
        id: 'ui-agreements.agreements.internalContacts',
      }),
    },
    {
      value: 'orgs',
      label: intl.formatMessage({
        id: 'ui-agreements.agreements.organizations',
      }),
    },
    {
      value: 'items',
      label: intl.formatMessage({
        id: 'ui-agreements.agreementLines',
      }),
    },
    {
      value: 'linkedLicenses',
      label: intl.formatMessage({
        id: 'ui-agreements.duplicateAgreementModal.linkedLicenses',
      }),
    },
    {
      value: 'externalLicenseDocs',
      label: intl.formatMessage({
        id: 'ui-agreements.duplicateAgreementModal.externalLicenses',
      }),
    },
    {
      value: 'supplementaryDocs',
      label: intl.formatMessage({
        id: 'ui-agreements.duplicateAgreementModal.supplementaryDocuments',
      }),
    },
    {
      value: 'usageDataProviders',
      label: intl.formatMessage({
        id: 'ui-agreements.duplicateAgreementModal.usageData',
      }),
    },
    {
      value: 'tags',
      label: intl.formatMessage({
        id: 'ui-agreements.agreements.tags',
      }),
    },
  ];
};

export default useAgreementContentOptions;
