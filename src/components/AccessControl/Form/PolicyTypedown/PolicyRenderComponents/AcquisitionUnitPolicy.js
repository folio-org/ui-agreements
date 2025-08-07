import { useIntl } from 'react-intl';

import { Layout } from '@folio/stripes/components';
import { highlightString } from '@k-int/stripes-kint-components';

import Separator from './Separator';
import css from '../Styles.css';

const AcquisitionUnitPolicy = ({
  isSelected,
  policy,
  typed,
}) => {
  const intl = useIntl();

  const policyRestrictions = ['protectRead', 'protectUpdate', 'protectCreate', 'protectDelete'].map(restriction => {
    return policy[restriction] ? intl.formatMessage({ id: `ui-agreements.accesscontrol.acquisitionunits.${restriction}` }) : null;
  }).filter(Boolean);

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
        {policyRestrictions.join(', ')}
      </Layout>
    </Layout>
  );
};

export default AcquisitionUnitPolicy;
