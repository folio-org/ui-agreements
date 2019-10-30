import {
  interactor,
  clickable,
  fillable,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class EresourcesInteractor {
  isPackageYesButtonPresent = isPresent('#clickable-filter-class-package');
  clickIsPackageYesButton = clickable('#clickable-filter-class-package');
  searchField = fillable('[data-test-eresource-search-input]');
  clickSearchButton = clickable('#clickable-search-eresources');
}
