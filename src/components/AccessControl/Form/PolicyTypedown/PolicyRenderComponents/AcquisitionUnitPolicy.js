import { useIntl } from 'react-intl';

import { Layout } from '@folio/stripes/components';
import Separator from './Separator';

import css from './Styles.css';

const AcquisitionUnitPolicy = ({ policy }) => {
  const intl = useIntl();

  const policyRestrictions = ['protectRead', 'protectUpdate', 'protectCreate', 'protectDelete'].map(restriction => {
    return policy[restriction] ? intl.formatMessage({ id: `ui-agreements.accesscontrol.acquisitionunits.${restriction}` }) : null;
  }).filter(Boolean);

  return (
    <Layout className="display-flex">
      <Layout className="display-flex">
        {policy.name}
      </Layout>
      <Separator />
      <Layout className={`display-flex ${css.itemMargin} ${css.greyItem}`}>
        {policy.description}
      </Layout>
      <Separator />
      <Layout className={`display-flex ${css.itemMargin} ${css.greyItem}`}>
        {policyRestrictions.join(', ')}
      </Layout>
    </Layout>
  );
};

export default AcquisitionUnitPolicy;
