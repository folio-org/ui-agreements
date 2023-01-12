import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { NoteEditPage } from '@folio/stripes/smart-components';
import { formatNoteReferrerEntityData, urls } from '../../components/utilities';
import {
  entityTypeTranslationKeys,
  entityTypePluralizedTranslationKeys,
} from '../../constants';

const NoteEditRoute = ({
  history,
  location: { state: locationState },
  match: { params: { id } }
}) => {
  const goToNoteView = () => {
    history.replace({
      pathname: urls.noteView(id),
      state: locationState,
    });
  };

  return (
    <NoteEditPage
      domain="agreements"
      entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
      entityTypeTranslationKeys={entityTypeTranslationKeys}
      navigateBack={goToNoteView}
      noteId={id}
      paneHeaderAppIcon="agreement"
      referredEntityData={formatNoteReferrerEntityData(locationState)}
    />
  );
};

NoteEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NoteEditRoute;
