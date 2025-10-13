import PropTypes from 'prop-types';
import PackageCard from '../../PackageCard';
import PackageCardExternal from '../../PackageCardExternal';
import TitleCard from '../../TitleCard';
import TitleCardExternal from '../../TitleCardExternal';
import { resourceClasses, BASKET_TYPE_GOKB_TITLE } from '../../../constants';

const propTypes = {
  headerEnd: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  resource: PropTypes.shape({}),
};

const isExternal = (resource) => {
  return (
    resource.type === 'external' ||
    resource.type === 'packages' ||
    resource.type === 'resources' ||
    resource.type === BASKET_TYPE_GOKB_TITLE
  );
};

const isPackage = (resource) => {
  return (
    resource.class === resourceClasses?.PACKAGE ||
    resource.reference_object?.type === 'Package' ||
    resource.type === 'packages'
  );
};

const FormEresourceCard = ({
  headerEnd,
  resource,
}) => {
  return (
    <>
      {isExternal(resource) ?
        isPackage(resource) ?
          <PackageCardExternal
            component={PackageCardExternal}
            headerEnd={headerEnd}
            packageData={resource}
          />
          :
          <TitleCardExternal
            component={TitleCardExternal}
            headerEnd={headerEnd}
            title={resource}
          />
        :
        isPackage(resource) ?
          <PackageCard
            component={PackageCard}
            headerEnd={headerEnd}
            pkg={resource}
          />
          :
          <TitleCard
            component={TitleCard}
            headerEnd={headerEnd}
            title={resource}
          />
      }
    </>
  );
};

FormEresourceCard.propTypes = propTypes;
export default FormEresourceCard;
