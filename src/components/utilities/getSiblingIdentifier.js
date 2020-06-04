import React from 'react';

import { Layout } from '@folio/stripes/components';

export default function (eresource = {}, type) {
  const relatedTitles = eresource?.relatedTitles || [];
  const printSiblings = relatedTitles.find(r => r.subType.value === 'print');
  if (!printSiblings) return null;
  const identifiers = printSiblings.identifiers;

  const entry = identifiers.find(i => i.identifier.ns.value === type);

  const value = entry?.identifier?.value;
  if (!value) return null;


  if (Array.isArray(value)) {
    return (
      <Layout className="display-flex flex-direction-column">
        {value.map((v, i) => <div key={i}>{v}</div>)}
      </Layout>
    );
  }

  return value;
}
