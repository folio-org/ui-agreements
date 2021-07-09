import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, Layout } from '@folio/stripes/components';
import { DocumentCard } from '@folio/stripes-erm-components';
import { useStripes } from '@folio/stripes/core';

const ExternalLicenses = ({
  agreement: {
    externalLicenseDocs: externalLicenses = []
  } = {},
  handlers,
  id
}) => {
  const stripes = useStripes();

  const renderExternalLicense = license => {
    return (
      <DocumentCard
        key={license.id}
        hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
        onDownloadFile={handlers.onDownloadFile}
        {...license}
      />
    );
  };

  const renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.emptyAccordion.externalLicenses" />
    </Layout>
  );

  return (
    <Accordion
      displayWhenClosed={<Badge>{externalLicenses.length}</Badge>}
      displayWhenOpen={<Badge>{externalLicenses.length}</Badge>}
      id={id}
      label={<FormattedMessage id="ui-agreements.license.externalLicenses" />}
    >
      { externalLicenses.length ? externalLicenses.map(renderExternalLicense) : renderEmpty() }
    </Accordion>
  );
};

ExternalLicenses.propTypes = {
  agreement: PropTypes.shape({
    externalLicenseDocs: PropTypes.arrayOf(
      PropTypes.shape({
        dateCreated: PropTypes.string,
        lastUpdated: PropTypes.string,
        location: PropTypes.string,
        name: PropTypes.string.isRequired,
        note: PropTypes.string,
        url: PropTypes.string,
      }),
    ),
  }),
  handlers: PropTypes.shape({
    onDownloadFile: PropTypes.func,
  }).isRequired,
  id: PropTypes.string,
};

export default ExternalLicenses;
