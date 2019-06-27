import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge } from '@folio/stripes/components';
import { DocumentCard } from '@folio/stripes-erm-components';

export default class SupplementaryInfo extends React.Component {
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
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderDocs = (docs) => {
    return docs.map(doc => (
      <DocumentCard
        key={doc.id}
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
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        id={id}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        label={<FormattedMessage id="ui-agreements.agreements.supplementaryInfo" />}
        open={open}
        onToggle={onToggle}
      >
        {supplementaryDocs.length ?
          this.renderDocs(supplementaryDocs) :
          <FormattedMessage id="ui-agreements.supplementaryInfo.agreementHasNone" />
        }
      </Accordion>
    );
  }
}
