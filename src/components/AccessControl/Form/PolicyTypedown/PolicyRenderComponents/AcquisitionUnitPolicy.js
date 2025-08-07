import { useIntl } from 'react-intl';

import { Layout } from '@folio/stripes/components';
import { highlightString } from '@k-int/stripes-kint-components';

import Separator from './Separator';
import css from '../Styles.css';

export const acquisitionPolicyRestrictions = (policy, intl) => ['protectRead', 'protectUpdate', 'protectCreate', 'protectDelete'].map(restriction => {
  return policy[restriction] ? intl.formatMessage({ id: `ui-agreements.accesscontrol.acquisitionunits.${restriction}` }) : null;
}).filter(Boolean).join(', ');

const AcquisitionUnitPolicy = ({
  isSelected,
  policy,
  typed,
}) => {
  const intl = useIntl();

  return (
    <Layout className="display-flex">
      <Layout className="display-flex">
        {
          highlightString(
            typed,
            policy.name,
          )
        }
      </Layout>
      <Separator />
      <Layout className={`display-flex ${css.itemMargin} ${isSelected ? '' : css.greyItem}`}>
        {
          highlightString(
            typed,
            policy.description,
          )
        }
      </Layout>
      <Separator />
      <Layout className={`display-flex ${css.itemMargin} ${isSelected ? '' : css.greyItem}`}>
        {acquisitionPolicyRestrictions(policy, intl)}
      </Layout>
    </Layout>
  );
};

export default AcquisitionUnitPolicy;
