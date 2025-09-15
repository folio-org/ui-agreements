import { resourceClasses } from '../../constants';

export const buildPackageEntitlementOption = (pkg) => ({
  class: resourceClasses.PACKAGE,
  id: pkg.id,
  name: pkg.name,
  _object: pkg,
});

export const buildPCIEntitlementOption = (pci) => ({
  class: resourceClasses.PCI,
  id: pci.id,
  name: pci.name,
  _object: pci,
});
