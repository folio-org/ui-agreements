import React from 'react';
import { Icon, Layout } from '@folio/stripes/components';

export default function CustomCoverage() {
  return (
    <Layout
      className="flex"
      data-test-custom-coverage
    >
      <Icon icon="clock" status="success" />
    </Layout>
  );
}
