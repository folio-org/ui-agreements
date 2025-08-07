import { useCallback, useState } from 'react';

import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, Spinner } from '@folio/stripes/components';

import { useClaimPolicies, useDoAccessControl } from '../hooks';
import { PolicyTypedown } from './PolicyTypedown';
import { PoliciesTable } from '../View';

const FormAccessControl = ({
  accessControlEndpoint, // THIS MUST BE THE BASE endpoint for accessControl
  onToggle,
  open
}) => {
  const { doAccessControl, enabledEnginesQuery } = useDoAccessControl({ endpoint: accessControlEndpoint });

  const { values } = useFormState();
  const { mutators } = useForm();

  // When we remove a policy that has an id from the resource we can store it in state,
  // so that if we decide to re-add it we don't lose the id/description fields
  const [removedPolicies, setRemovedPolicies] = useState([]);

  // We need to fetch the claimable policies
  const { flattenedClaimPolicies: claimPolicies } = useClaimPolicies({
    endpoint: accessControlEndpoint,
    queryOptions: {
      enabled: doAccessControl
    }
  });

  // A policy matches if its id AND type match (And quick exit if values don't exist)
  const findMatchingPolicy = useCallback((pol, value) => {
    return !!pol &&
    !!value &&
    pol.policy.id === value.policy.id &&
    pol.type === value.type;
  }, []);

  const onPolicyChange = useCallback(policy => {
    // If selected policy already exists in the form values
    if ((values.claimPolicies ?? []).some(pol => findMatchingPolicy(pol, policy))) {
      // Remove it
      const removeIndex = (values.claimPolicies ?? []).findIndex(pol => findMatchingPolicy(pol, policy));

      // Store removed ones with id in state, so we can put those back if we want
      //  If you remove then re-add a policy we shouldn't nuke the id and desc
      if (policy.id) {
        setRemovedPolicies([...removedPolicies, policy]); // ACK this won't work, as the change is coming from the selection. We need the full thing to be in the right shape, not transformed between
      }

      mutators.remove('claimPolicies', removeIndex);
    } else {
      // Else add it to the end of the form values (ensuring we either grab from removed policies or transform to the shape, see below)

      const preRemovedPolicy = removedPolicies.find(pol => pol.policy.id === policy.policy.id);
      if (preRemovedPolicy) {
        mutators.push('claimPolicies', preRemovedPolicy);
      } else {
        mutators.push('claimPolicies', policy);
      }
    }
  }, [findMatchingPolicy, mutators, removedPolicies, values.claimPolicies]);

  if (enabledEnginesQuery.isLoading) {
    return (<Spinner />);
  }

  if (!doAccessControl) {
    return null;
  }

  return (
    <Accordion
      displayWhenClosed={<Badge>{(values.claimPolicies ?? []).length}</Badge>}
      displayWhenOpen={<Badge>{(values.claimPolicies ?? []).length}</Badge>}
      id="formAccessControl"
      label={<FormattedMessage id="ui-agreements.accesscontrol.label" />}
      onToggle={onToggle}
      open={open}
    >
      <PolicyTypedown
        input={{
          name: 'myField',
          onChange: onPolicyChange
        }}
        isSelected={(_v, value) => {
          return (values.claimPolicies ?? []).some(pol => findMatchingPolicy(pol, value));
        }}
        policies={claimPolicies}
      />
      {/* hidden field array (for now, will eventually be an MCL) */}
      <FieldArray
        name="claimPolicies"
        render={() => (
          <PoliciesTable
            allowRemove
            onRemove={onPolicyChange}
            policies={values.claimPolicies}
          />
        )}
      />
    </Accordion>
  );
};

export default FormAccessControl;
