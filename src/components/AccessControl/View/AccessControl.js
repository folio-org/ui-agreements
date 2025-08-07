import { Accordion, Badge } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PoliciesTable from './PoliciesTable';

const AccessControl = ({
  onToggle,
  open,
  policies,
}) => {
  return (
    <Accordion
      displayWhenClosed={<Badge>{(policies ?? []).length}</Badge>}
      displayWhenOpen={<Badge>{(policies ?? []).length}</Badge>}
      id="accessControl"
      label={<FormattedMessage id="ui-agreements.accesscontrol.label" />}
      onToggle={onToggle}
      open={open}
    >
      <PoliciesTable
        policies={policies}
      />
    </Accordion>
  );
};

export default AccessControl;
