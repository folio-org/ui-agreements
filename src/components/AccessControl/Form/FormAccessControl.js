import { useCallback, useState } from 'react';

import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, Badge, IconButton, MultiColumnList } from '@folio/stripes/components';

import { useClaimPolicies } from '../hooks';

import { PolicyTypedown } from './PolicyTypedown';
import { acquisitionPolicyRestrictions } from './PolicyTypedown/PolicyRenderComponents';
import useDoAccessControl from '../hooks/useDoAccessControl';

// TODO This should be centralised, but we must make sure that all the endpoints etc etc are module/resource specific
const FormAccessControl = ({
  accessControlEndpoint, // THIS MUST BE THE BASE endpoint for accessControl
  onToggle,
  open
}) => {
  const intl = useIntl();
  const { doAccessControl } = useDoAccessControl({ endpoint: accessControlEndpoint });

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
          <MultiColumnList
            columnMapping={{
              name: <FormattedMessage id="ui-agreements.accesscontrol.name" />,
              description: <FormattedMessage id="ui-agreements.accesscontrol.description" />,
              restrictions: <FormattedMessage id="ui-agreements.accesscontrol.restrictions" />,
              remove: <FormattedMessage id="ui-agreements.accesscontrol.remove" />,
            }}
            contentData={values.claimPolicies}
            formatter={{
              name: (rowData) => rowData.policy.name,
              description: (rowData) => rowData.policy.description,
              restrictions: (rowData) => acquisitionPolicyRestrictions(rowData.policy, intl), // TODO this will break if we have any other access controls in future
              // We can do OnPolicyChange because if it's in the table then we're definitely removing it
              remove: (rowData) => <IconButton icon="trash" onClick={() => onPolicyChange(rowData)} />
            }}
            interactive={false}
            visibleColumns={['name', 'description', 'restrictions', 'remove']} // FIXME these need mappings etc
          />
        )}
      />
    </Accordion>
  );
};

export default FormAccessControl;
