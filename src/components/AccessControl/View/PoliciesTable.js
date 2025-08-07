import { useMemo } from 'react';
import noop from 'lodash/noop';

import { FormattedMessage, useIntl } from 'react-intl';

import { IconButton, MultiColumnList } from '@folio/stripes/components';

import { acquisitionPolicyRestrictions } from '../Form';

const PoliciesTable = ({
  policies,
  allowRemove = false,
  onRemove = noop,
}) => {
  const intl = useIntl();

  const visibleColumns = useMemo(() => {
    const cols = ['name', 'description', 'restrictions'];
    if (allowRemove) {
      cols.push('remove');
    }
    return cols;
  }, [allowRemove]);

  return (
    <MultiColumnList
      columnMapping={{
        name: <FormattedMessage id="ui-agreements.accesscontrol.name" />,
        description: <FormattedMessage id="ui-agreements.accesscontrol.description" />,
        restrictions: <FormattedMessage id="ui-agreements.accesscontrol.restrictions" />,
        remove: <FormattedMessage id="ui-agreements.accesscontrol.remove" />,
      }}
      contentData={policies}
      formatter={{
        name: (rowData) => rowData.policy.name,
        description: (rowData) => rowData.policy.description,
        restrictions: (rowData) => acquisitionPolicyRestrictions(rowData.policy, intl), // NOTE: This will break if we have any other access controls in future
        // We can do OnPolicyChange because if it's in the table then we're definitely removing it
        remove: (rowData) => <IconButton icon="trash" onClick={() => onRemove(rowData)} />
      }}
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

export default PoliciesTable;
