import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { EditableRefdataCategoryList } from '@k-int/stripes-kint-components';

import { useStripes } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

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
    <Pane
      defaultWidth="fill"
      dismissible
      id="edit-refdata-desc"
      onClose={() => history.push('/settings/erm')}
      paneTitle={
        <FormattedMessage id="ui-agreements.settings.pickLists" />
      }
    >
      <EditableRefdataCategoryList
        displayConditions={displayConditions}
        label={
          <FormattedMessage id="ui-agreements.settings.pickLists" />
        }
        refdataEndpoint={REFDATA_ENDPOINT}
      />
    </Pane>
  );
};

export default PickListSettings;
