import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';
import { DocumentCard } from '@folio/stripes-erm-components';
import { withStripes } from '@folio/stripes/core';

class SupplementaryDocs extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func,
    }),
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
    id: PropTypes.string,
    stripes: PropTypes.object
  };

  renderDocs = (docs) => {
    const { stripes } = this.props;
    return docs.map(doc => (
      <DocumentCard
        key={doc.id}
        hasDownloadPerm={stripes.hasPerm('ui-agreements.agreements.file.download')}
        onDownloadFile={this.props.handlers.onDownloadFile}
        {...doc}
      />
    ));
  }

  renderBadge = () => {
    const count = get(this.props.agreement, 'supplementaryDocs.length');
    return <Badge>{count}</Badge>;
  }

  render() {
    const {
      agreement: { supplementaryDocs = [] },
      id,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.supplementaryDocuments" />}
      >
        {supplementaryDocs.length ?
          this.renderDocs(supplementaryDocs) :
          <FormattedMessage id="ui-agreements.emptyAccordion.supplementaryDocuments" />
        }
      </Accordion>
    );
  }
}

export default withStripes(SupplementaryDocs);
