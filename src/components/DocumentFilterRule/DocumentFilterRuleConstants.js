import { useIntl } from 'react-intl';

const DocumentFilterRuleConstants = (useDocs) => {
  const intl = useIntl();
  const docType = useDocs ? 'docs' : '';

  const operators = [
    { label: '', value: '' },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.operator.is' }),
      value: '==',
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.operator.contains' }),
      value: '=~',
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.operator.doesNotContain' }),
      value: '!~',
    },
  ];

  const attributes = [
    { label: '', value: '' },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.doc.name' }),
      value: `${docType}.name`,
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.doc.note' }),
      value: `${docType}.note`,
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.doc.location' }),
      value: `${docType}.location`,
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.doc.url' }),
      value: `${docType}.url`,
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.contentType' }),
      value: `${docType}.fileUpload.fileContentType`,
    },
    {
      label: intl.formatMessage({ id: 'stripes-erm-components.fuf.filename' }),
      value: `${docType}.fileUpload.fileName`,
    },
  ];

  if (useDocs) {
    attributes.splice(3, 0, {
      label: intl.formatMessage({ id: 'stripes-erm-components.doc.category' }),
      value: `${docType}.atType.value`,
    });
  }

  return { operators, attributes };
};

export default DocumentFilterRuleConstants;
