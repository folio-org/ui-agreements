import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

export default @interactor class PackageContentInteractor {
  eresourceName = text('[data-test-eresource-name]');
  clickAll = clickable('#clickable-pci-all');
  clickCurrent = clickable('#clickable-pci-current');
  clickDropped = clickable('#clickable-pci-dropped');
  clickFuture = clickable('#clickable-pci-future');
}
