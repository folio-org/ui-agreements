import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';
import { DocumentCard, useFileHandlers } from '@folio/stripes-erm-components';
import { useStripes } from '@folio/stripes/core';

const Documents = ({ line: { docs = {} } = {}, id }) => {
  const stripes = useStripes();
  const { handleDownloadFile } = useFileHandlers('erm/files');
  console.log('docs %O:', docs);
  const renderDocs = (docs) => {
    return docs.map((doc) => (
      <DocumentCard
        key={doc.id}
        hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
        onDownloadFile={handleDownloadFile}
        {...doc}
      />
    ));
  };

  const renderBadge = () => {
    const count = docs.length;
    return <Badge>{count}</Badge>;
  };

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id={id}
      label={<FormattedMessage id="ui-agreements.line.documents" />}
    >
      {docs.length ? (
        renderDocs(docs)
      ) : (
        <FormattedMessage id="ui-agreements.emptyAccordion.documents" />
      )}
    </Accordion>
  );
};

Documents.propTypes = {
  line: PropTypes.shape({
    docs: PropTypes.arrayOf(
      PropTypes.shape({
        dateCreated: PropTypes.string,
        lastUpdated: PropTypes.string,
        location: PropTypes.string,
        name: PropTypes.string.isRequired,
        note: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }),
  id: PropTypes.string,
};

export default Documents;
