import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { NoValue } from '@folio/stripes/components';


const PackageSyncronisingValue = ({ syncContentsFromSource }) => {
  const intl = useIntl();
  if (syncContentsFromSource !== null) {
    return intl.formatMessage({
      id: `ui-agreements.eresources.syncContentsFromSource.${syncContentsFromSource}`,
    });
  }
  return <NoValue />;
};

PackageSyncronisingValue.propTypes = {
  syncContentsFromSource: PropTypes.bool,
};

export default PackageSyncronisingValue;
