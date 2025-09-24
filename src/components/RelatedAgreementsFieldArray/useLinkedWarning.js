import React, { useEffect, useState } from 'react';

const useLinkedWarning = (change, input, parentAgreementId, triggerButton) => {
  const [selfLinkedWarning, setSelfLinkedWarning] = useState(false);

  useEffect(() => {
    if (!input.value?.id && triggerButton.current) {
      triggerButton.current.focus();
    }
  }, [input, triggerButton]);

  useEffect(() => {
    if (parentAgreementId && parentAgreementId === input.value?.id && !selfLinkedWarning) {
      change(input.name, undefined);
      setSelfLinkedWarning(true);
    }
    if (input.value && parentAgreementId !== input.value?.id && selfLinkedWarning) {
      setSelfLinkedWarning(false);
    }
  }, [change, input, parentAgreementId, selfLinkedWarning, setSelfLinkedWarning]);

  return { selfLinkedWarning, setSelfLinkedWarning };
};

export default useLinkedWarning;
