import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';
import { DocumentCard, useFileHandlers } from '@folio/stripes-erm-components';
import { useStripes } from '@folio/stripes/core';

const SupplementaryDocs = ({
  agreement: { supplementaryDocs = [] } = {},
  id
}) => {
  const stripes = useStripes();
  const { handleDownloadFile } = useFileHandlers('erm/files');

  const renderDocs = (docs) => {
    return docs.map(doc => (
      <DocumentCard
        key={doc.id}
        hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
        onDownloadFile={handleDownloadFile}
        {...doc}
      />
    ));
  };

  const renderBadge = () => {
    const count = supplementaryDocs.length;
    return <Badge>{count}</Badge>;
  };

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id={id}
      label={<FormattedMessage id="ui-agreements.supplementaryDocuments" />}
    >
      {supplementaryDocs.length ?
        renderDocs(supplementaryDocs) :
        <FormattedMessage id="ui-agreements.emptyAccordion.supplementaryDocuments" />
      }
    </Accordion>
  );
};

SupplementaryDocs.propTypes = {
  agreement: PropTypes.shape({
    supplementaryDocs: PropTypes.arrayOf(
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
  id: PropTypes.string
};

export default SupplementaryDocs;
