import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import {
  formatNoteReferrerEntityData,
  urls,
} from '../components/utilities';

class NoteViewRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  onEdit = () => {
    const { history, location, match } = this.props;

    history.replace({
      pathname: urls.noteEdit(match.params.id),
      state: location.state,
    });
  };

  navigateBack = () => {
    const { history, location } = this.props;

    if (location.state) {
      history.goBack();
    } else {
      history.push({ pathname: urls.agreements() });
    }
  };

  render() {
    const { location, match } = this.props;

    return (
      <NoteViewPage
        entityTypeTranslationKeys={{
          agreement: 'ui-agreements.notes.entityType.agreement',
        }}
        entityTypePluralizedTranslationKeys={{
          agreement: 'ui-agreements.notes.entityType.agreement.pluralized',
        }}
        navigateBack={this.navigateBack}
        onEdit={this.onEdit}
        paneHeaderAppIcon="agreement"
        referredEntityData={formatNoteReferrerEntityData(location.state)}
        noteId={match.params.id}
      />
    );
  }
}

export default NoteViewRoute;
