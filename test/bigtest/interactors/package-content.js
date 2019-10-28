import {
  interactor,
  clickable,
  fillable,
  isPresent,
  selectable,
  text,
} from '@bigtest/interactor';

export default @interactor class PackageContentInteractor {
  // isDeleteButtonPresent = isPresent('[data-test-external-data-source-delete]');
  // isEditButtonPresent = isPresent('[data-test-external-data-source-edit]');
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


  // clickEditButton = clickable('[data-test-external-data-source-edit]');

  // isNamePresent = isPresent('[data-test-external-data-source-name]');
  // isTypePresent = isPresent('[data-test-external-data-source-type]');
  // isRecordTypePresent = isPresent('[data-test-external-data-source-recordtype]');
  // isURIPresent = isPresent('[data-test-external-data-source-uri]');
  // isActivePresent = isPresent('[data-test-external-data-source-isactive]');
  // isSupportsHarvestingPresent = isPresent('[data-test-external-data-source-supportsharvesting]');
  // isActivationEnabledPresent = isPresent('[data-test-external-data-source-activationenabled]');
  // isListPrefixPresent = isPresent('[data-test-external-data-source-listprefix]');
  // isFullPrefixPresent = isPresent('[data-test-external-data-source-fullprefix]');
  // isPrincipalPresent = isPresent('[data-test-external-data-source-principal]');
  // isCredentialsPresent = isPresent('[data-test-external-data-source-credentials]');

  // name = new KeyValueInteractor('[data-test-external-data-source-name]');
  // type = new KeyValueInteractor('[data-test-external-data-source-type]');
  // recordType = new KeyValueInteractor('[data-test-external-data-source-recordtype]');
  // uri = new KeyValueInteractor('[data-test-external-data-source-uri]');
  // isActive = new KeyValueInteractor('[data-test-external-data-source-isactive]');
  // isSupportsHarvesting = new KeyValueInteractor('[data-test-external-data-source-supportsharvesting]');
  // isActivationEnabled = new KeyValueInteractor('[data-test-external-data-source-activationenabled]');
  // listPrefix = new KeyValueInteractor('[data-test-external-data-source-listprefix]');
  // fullPrefix = new KeyValueInteractor('[data-test-external-data-source-fullprefix]');
  // principal = new KeyValueInteractor('[data-test-external-data-source-principal]');
  // credentials = new KeyValueInteractor('[data-test-external-data-source-credentials]');
}
