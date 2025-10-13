import PropTypes from 'prop-types';
import EholdingsTitleCard from './EholdingsTitleCard';
import GokbTitleCard from './GokbTitleCard';
import { BASKET_TYPE_GOKB_TITLE, GOKB_RESOURCE_AUTHORITY } from '../../constants';

const TitleCardExternal = ({ headerEnd, title }) => {
  const isGokbTitle = title?.type === BASKET_TYPE_GOKB_TITLE || title?.authority === GOKB_RESOURCE_AUTHORITY;
  const ComponentToRender = isGokbTitle ? GokbTitleCard : EholdingsTitleCard;

  return <ComponentToRender headerEnd={headerEnd} title={title} />;
};

TitleCardExternal.propTypes = {
  headerEnd: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  title: PropTypes.shape({}),
};

export default TitleCardExternal;
