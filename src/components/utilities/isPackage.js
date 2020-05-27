import { resourceClasses } from '../../constants';

export default function isPackage(resource) {
  return (
    resource.class === resourceClasses.PACKAGE ||
    resource.reference_object?.type === 'Package'
  );
}
