import { useCallback, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';

import { Typedown } from '@k-int/stripes-kint-components';

import { ACQUISITION_UNIT_POLICY_TYPE } from '../../constants';
import { AcquisitionUnitPolicy } from './PolicyRenderComponents';

const PolicyTypedown = ({
  input,
  policies = []
} = {}) => {
  const [typed, setTyped] = useState('');
  const [policyOptions, setPolicyOptions] = useState(policies);

  const renderPolicyOption = useCallback((option, currentlyTyped, exactMatch, optionIsSelected) => {
    console.log("RPO option: %o", option);
    console.log("RPO currentlyTyped: %o", currentlyTyped);
    console.log("RPO exactMatch: %o", exactMatch);
    console.log("RPO optionIsSelected: %o", optionIsSelected);

    switch (option.type) {
      case ACQUISITION_UNIT_POLICY_TYPE:
        return <AcquisitionUnitPolicy policy={option} />;
      default:
        return `${option.type} · ${option.id}`;
    }
  }, []);

  // The "type" logic needs to DIFFER for each policy type :(
  const onType = useCallback(e => {
    if (e.target.value !== typed) {
      setTyped(e.target.value);
    }
  }, [typed]);

  useEffect(() => {
    const newPolicyOptions = policies.filter(pol => {
      // Each policy type may have DIFFERENT filter logic.
      // Should probs be in their own files.
      switch (pol.type) {
        case ACQUISITION_UNIT_POLICY_TYPE:
          return (
            pol.name.toLowerCase().includes(typed.toLowerCase()) ||
            pol.description.toLowerCase().includes(typed.toLowerCase())
          );
        default:
          return pol.id.toLowerCase().includes(typed.toLowerCase());
      }
    });

    if (!isEqual(newPolicyOptions, policyOptions)) {
      setPolicyOptions(newPolicyOptions);
    }
  }, [policies, policyOptions, typed]);

  return (
    <Typedown
      dataOptions={policyOptions}
      input={input}
      label="Select an option" // FIXME fix the label
      onType={onType}
      renderListItem={renderPolicyOption}
    />
  );
};

export default PolicyTypedown;
