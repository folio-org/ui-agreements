import {
  interactor,
  clickable,
  fillable,
  isPresent,
  selectable,
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

  addToBasketButtion = clickable('[data-test-add-package-to-basket]');
  clickOpenBasket = clickable('#open-basket-button');
  clickCreateNewAgreement = clickable('[data-test-basket-create-agreement]');

  fillName = fillable('#edit-agreement-name');
  selectStatus = selectable('#edit-agreement-status');

  processDate = fillable('#period-start-date-0');
  createAgreement = clickable('#clickable-create-agreement');

  isViewAgreement = isPresent('#pane-view-agreement');
  clickLinesAccordion = clickable('#accordion-toggle-button-lines');

  whenLoaded() {
    return this.when(() => this.isViewAgreement);
  }
}
