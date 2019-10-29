import {
  interactor,
  clickable,
  fillable,
  isPresent,
  text,
} from '@bigtest/interactor';

export default @interactor class PackageContentInteractor {
  isPackageYesButtonPresent = isPresent('#clickable-filter-class-package');
  clickIsPackageYesButton = clickable('#clickable-filter-class-package');
  searchField = fillable('[data-test-eresource-search-input]');
  clickSearchButton = clickable('#clickable-search-eresources');

  headline = text('#package-info [data-test-headline]');
  eresourceName = text('[data-test-eresource-name]');
  clickFuture = clickable('#clickable-pci-future');
  clickDropped = clickable('#clickable-pci-dropped');
}
