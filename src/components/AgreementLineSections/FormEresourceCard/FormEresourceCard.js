import PropTypes from 'prop-types';
import PackageCard from '../../PackageCard';
import PackageCardExternal from '../../PackageCardExternal';
import TitleCard from '../../TitleCard';
import TitleCardExternal from '../../TitleCardExternal';
import { resourceClasses, BASKET_TYPE_GOKB_TITLE } from '../../../constants';

const propTypes = {
  headerEnd: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  resource: PropTypes.shape({}),
};

const FormEresourceCard = ({ headerEnd, resource }) => {
  const isGokbTitle = resource?.type === BASKET_TYPE_GOKB_TITLE;

  const isPackage =
    resource?.class === resourceClasses?.PACKAGE ||
    resource?.reference_object?.type === 'Package' ||
    resource?.type === 'packages';

  const isExternal =
    isGokbTitle ||
    resource?.type === 'external' ||
    resource?.type === 'packages' ||
    resource?.type === 'resources';

  if (isExternal) {
    return isPackage ? (
      <PackageCardExternal headerEnd={headerEnd} packageData={resource} />
    ) : (
      <TitleCardExternal
        headerEnd={headerEnd}
        title={resource} // passes the fallback explicitly
      />
    );
  }

  return isPackage ? (
    <PackageCard headerEnd={headerEnd} pkg={resource} />
  ) : (
    <TitleCard headerEnd={headerEnd} title={resource} />
  );
};

FormEresourceCard.propTypes = propTypes;
export default FormEresourceCard;
