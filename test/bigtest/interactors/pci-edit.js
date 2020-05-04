import {
  clickable,
  collection,
  count,
  interactor,
  isPresent,
  value,
} from '@bigtest/interactor';

@interactor class coverageCardInteractor {
  startDate = value('[id^="cc-start-date"]');
  endDate = value('[id^="cc-end-date"]');
  startVolume = value('[id^="cc-start-volume"]');
  endVolume = value('[id^="cc-end-volume"]');
  startIssue = value('[id^="cc-start-issue"]');
  endIssue = value('[id^="cc-end-issue"]');
}

export default @interactor class PCIEditPaneInteractor {
  isCoverageAccordionPresent = isPresent('#accordion-toggle-button-pci-form-coverage');
  isAddButtonPresent = isPresent('#edit-pci-add-coverage-button')
  pciName = value('[data-test-pci-name]');
  accessFrom = value('#pci-access-from');
  accessUntil = value('#pci-access-end');

  coverageCards = collection('#pci-form-coverages', coverageCardInteractor)
  coverageCount = count('[data-test-coverage-number]');
  clickAddButton = clickable('#edit-pci-add-coverage-button');
}
