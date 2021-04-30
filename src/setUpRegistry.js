import React from 'react';

import {
  FormattedUTCDate,
  NoValue,
} from '@folio/stripes/components';

import AgreementLookup from './AgreementLookup';

const setUpRegistry = (registry) => {
  // Agreement Resource
  const agreementReg = registry.registerResource('agreement');
  agreementReg.addViewAll('/erm/agreements');
  agreementReg.addViewTemplate(agreement => `/erm/agreements/${agreement.id}`);

  // Testing custom render function.
  agreementReg.setRenderFunction('currentPeriodStartDate', record => {
    const date = record.periods.find(p => p.periodStatus === 'current')?.startDate;
    return date ? <FormattedUTCDate value={date} /> :
    <NoValue />;
  });

  // Lookup plugin
  agreementReg.addLookupComponent(AgreementLookup);

  // AgreementLine Resource
  const aglReg = registry.registerResource('agreementLine');
  aglReg.addViewTemplate(al => `/erm/agreements/${al.owner?.id}/line/${al.id}`);
};

export default setUpRegistry;
