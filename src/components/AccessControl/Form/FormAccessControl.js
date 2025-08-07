import { useMemo } from 'react';

import { Accordion } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useClaimPolicies, useEnabledEngines } from '../hooks';
import { AGREEMENTS_ACCESSCONTROL_ENDPOINT } from '../../../constants';
import { ACQUISITION_UNIT_POLICY_TYPE } from '../constants';
import { PolicyTypedown } from './PolicyTypedown';

// TODO This should be centralised, but we must make sure that all the endpoints etc etc are module/resource specific
const FormAccessControl = ({
  accessControlEndpoint, // THIS MUST BE THE BASE endpoint for accessControl
  resourceEndpoint, // THIS MUST BE THE BASE endpoint for the resource (not including id)
  resourceId, // The resource id -- null if creating
  resourceType, // Agreement vs Entitlement etc etc -- used for query key generation
  onToggle,
  open,
  ...rest
}) => {
  // It is up to the BACKEND to check whether or not the various interfaces etc etc are present,
  // and to enrich with their information
  const enabledEngines = useEnabledEngines({ endpoint: AGREEMENTS_ACCESSCONTROL_ENDPOINT });
  const doAccessControl = useMemo(() => enabledEngines[ACQUISITION_UNIT_POLICY_TYPE] ?? false, [enabledEngines]); // For now, we only need to check acquisition units
  console.log("doAccessControl: %o", doAccessControl);

  console.log("WHAT IS REST: %o", rest);

  const ky = useOkapiKy();

  // We need to fetch the policies for the resource at hand
  // TODO this hook should be separate
  const { data: policies } = useQuery(
    ['ERM', resourceType, resourceId, 'policies'],
    () => ky.get(`${resourceEndpoint}/policies`).json(),
    {
      enabled: doAccessControl && !!resourceId
    }
  );

  console.log("WHAT ARE POLICIES: %o", policies);

  // We need to fetch the claimable policies
  // TODO this hook should be separate??
  const { flattenedClaimPolicies: claimPolicies } = useClaimPolicies({
    endpoint: accessControlEndpoint,
    queryOptions: {
      enabled: doAccessControl
    }
  });

  console.log("WHAT ARE CLAIM POLICIES: %o", claimPolicies);

  return (
    <Accordion
      displayWhenClosed={"FIXME REPLACE THIS"}
      displayWhenOpen={"FIXME REPLACE THIS"}
      id="formAccessControl"
      label={<FormattedMessage id="ui-agreements.accesscontrol.form.label" />}
      onToggle={onToggle}
      open={open}
    >
      <PolicyTypedown
        input={{
          name: 'myField',
          onChange: (value) => console.log(value), // FIXME obviously this needs to do something else
        }}
        policies={claimPolicies}
      />
    </Accordion>
  );
};

export default FormAccessControl;
