import React from 'react';

import { Layout } from '@folio/stripes/components';

export default function (eresource = {}, type) {
  const identifiers = eresource?.siblingIdentifiers || [];
  const entry = identifiers.find(i => i.identifier.ns.value === type);
  if (!entry) return '';

  const value = entry?.identifier?.value;
  if (!value) return '';

  if (Array.isArray(value)) {
    return (
      <Layout className="display-flex flex-direction-column">
        {value.map((v, i) => <div key={i}>{v}</div>)}
      </Layout>
    );
  }

  return value;
}
