import { useCallback, useMemo } from 'react';

import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { Accordion, MultiColumnList } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { useClaimPolicies, useEnabledEngines } from '../hooks';
import { AGREEMENTS_ACCESSCONTROL_ENDPOINT } from '../../../constants';
import { ACQUISITION_UNIT_POLICY_TYPE } from '../constants';

import { PolicyTypedown } from './PolicyTypedown';
import { acquisitionPolicyRestrictions } from './PolicyTypedown/PolicyRenderComponents';

// TODO This should be centralised, but we must make sure that all the endpoints etc etc are module/resource specific
const FormAccessControl = ({
  accessControlEndpoint, // THIS MUST BE THE BASE endpoint for accessControl
  resourceEndpoint, // THIS MUST BE THE BASE endpoint for the resource (not including id)
  resourceId, // The resource id -- null if creating
  resourceType, // Agreement vs Entitlement etc etc -- used for query key generation
  onToggle,
  open
}) => {
  const intl = useIntl();

  // It is up to the BACKEND to check whether or not the various interfaces etc etc are present,
  // and to enrich with their information
  const enabledEngines = useEnabledEngines({ endpoint: AGREEMENTS_ACCESSCONTROL_ENDPOINT });
  const doAccessControl = useMemo(() => enabledEngines[ACQUISITION_UNIT_POLICY_TYPE] ?? false, [enabledEngines]); // For now, we only need to check acquisition units

  const ky = useOkapiKy();

  const { values } = useFormState();
  console.log("Form values", values);
  const { mutators } = useForm();

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
  const { flattenedClaimPolicies: claimPolicies } = useClaimPolicies({
    endpoint: accessControlEndpoint,
    queryOptions: {
      enabled: doAccessControl
    }
  });

  console.log("WHAT ARE CLAIM POLICIES: %o", claimPolicies);

  // A policy matches if its id AND type match (And quick exit if values don't exist)
  const findMatchingPolicy = useCallback((pol, value) => {
    return !!pol &&
    !!value &&
    pol.id === value.id &&
    pol.type === value.type;
  }, []);

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
          onChange: (value) => {
            // If selected policy already exists in the form values
            if ((values.claimPolicies ?? []).some(pol => findMatchingPolicy(pol, value))) {
              // Remove itfindMatchingPolicy
              const removeIndex = (values.claimPolicies ?? []).findIndex(pol => findMatchingPolicy(pol, value));
              mutators.remove('claimPolicies', removeIndex);
            } else {
              // Else add it to the end of the form values
              mutators.push('claimPolicies', value);
            }
          }
        }}
        isSelected={(_v, value) => {
          return (values.claimPolicies ?? []).some(pol => findMatchingPolicy(pol, value))
        }}
        policies={claimPolicies}
      />
      {/* hidden field array (for now, will eventually be an MCL) */}
      <FieldArray
        name="claimPolicies"
        render={() => (
          <MultiColumnList
            contentData={values.claimPolicies}
            formatter={{
              restrictions: (rowData) => acquisitionPolicyRestrictions(rowData, intl) // TODO this will break if we have any other access controls in future
            }}
            visibleColumns={['name', 'description', 'restrictions']} // FIXME these need mappings etc
          />
        )}
      />
    </Accordion>
  );
};

export default FormAccessControl;
