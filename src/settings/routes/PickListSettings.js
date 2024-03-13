import { useHistory } from 'react-router';

import { RefdataCategoriesSettings } from '@k-int/stripes-kint-components';

import { useStripes } from '@folio/stripes/core';

import { REFDATA_ENDPOINT } from '../../constants';

const PickListSettings = () => {
  const history = useHistory();
  const stripes = useStripes();
  const perm = stripes.hasPerm('ui-agreements.picklists.manage');
  const displayConditions = {
    create: perm,
    delete: perm,
    edit: perm
  };

  return (
    <RefdataCategoriesSettings
      displayConditions={displayConditions}
      onClose={() => history.push('/settings/erm')}
      refdataEndpoint={REFDATA_ENDPOINT}
    />
  );
};

export default PickListSettings;
