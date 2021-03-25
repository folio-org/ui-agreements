import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import {
  formatNoteReferrerEntityData,
} from '../components/utilities';

import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
} from '../constants';

export default class NoteEditRoute extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      location,
      match,
      history,
    } = this.props;

    return (
      <NoteEditPage
        domain="agreements"
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        navigateBack={history.goBack}
        noteId={match.params.id}
        paneHeaderAppIcon="agreement"
        referredEntityData={formatNoteReferrerEntityData(location.state)}
      />
    );
  }
}
