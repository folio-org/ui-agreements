const PACKAGE_CLASS = 'org.olf.kb.Pkg';

export default function isPackage(resource) {
  return resource.class === PACKAGE_CLASS;
}
