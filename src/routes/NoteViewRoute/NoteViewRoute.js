import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import {
  formatNoteReferrerEntityData,
  urls,
} from '../../components/utilities';

import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
} from '../../constants';

const NoteViewRoute = ({
  history,
  location: { state: locationState },
  match: { params: { id } }
}) => {
  const onEdit = () => {
    history.replace({
      pathname: urls.noteEdit(id),
      state: locationState,
    });
  };

  const navigateBack = () => {
    if (locationState) {
      history.goBack();
    } else {
      history.push({ pathname: urls.agreements() });
    }
  };

  return (
    <NoteViewPage
      entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
      entityTypeTranslationKeys={entityTypeTranslationKeys}
      navigateBack={navigateBack}
      noteId={id}
      onEdit={onEdit}
      paneHeaderAppIcon="agreement"
      referredEntityData={formatNoteReferrerEntityData(locationState)}
    />
  );
};

NoteViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NoteViewRoute;
