import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Layout } from '@folio/stripes/components';

import css from './Styles.css';

// FIXME could probs move this to kint-comps, used here and in number generator

// CSS Components
const cssLayoutItem = `display-flex ${css.itemMargin}`;
const cssLayoutGreyItem = (isSelected) => { return isSelected ? cssLayoutItem : `${cssLayoutItem} ${css.greyItem}`; };
const cssLayoutBoldItem = `${cssLayoutItem} ${css.boldItem}`;

const Separator = ({ bold = false, isSelected = false }) => (
  <Layout
    className={bold ? cssLayoutBoldItem : cssLayoutGreyItem(isSelected)}
  >
    <FormattedMessage id="ui-agreements.separator" />
  </Layout>
);

Separator.propTypes = {
  bold: PropTypes.bool,
  isSelected: PropTypes.bool
};
export default Separator;
