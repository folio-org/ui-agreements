import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router-dom';
import { NoteCreatePage } from '@folio/stripes/smart-components';
import { formatNoteReferrerEntityData, urls } from '../../components/utilities';
import { entityTypeTranslationKeys } from '../../constants';

const NoteCreateRoute = ({ history, location: { state: locationState } }) => {
  const renderCreatePage = () => {
    return (
      <NoteCreatePage
        domain="agreements"
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        navigateBack={history.goBack}
        paneHeaderAppIcon="agreements"
        referredEntityData={formatNoteReferrerEntityData(locationState)}
      />
    );
  };

  if (locationState) {
    return renderCreatePage();
  }

  return <Redirect to={urls.agreements()} />;
};

NoteCreateRoute.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default NoteCreateRoute;
