import { parseMclPageSize } from '../utilities';
import { useAgreementsDisplaySettings } from '../../hooks';
import EntitlementAgreementsBaseList from './EntitlementAgreementsBaseList';

// Wrapper that uses the settings hook (default)
const EntitlementAgreementsList = (props) => {
  const settings = useAgreementsDisplaySettings();
  const pageSize = parseMclPageSize(settings, 'entitlements');
  return <EntitlementAgreementsBaseList {...props} pageSize={pageSize} />;
};

export default EntitlementAgreementsList;
