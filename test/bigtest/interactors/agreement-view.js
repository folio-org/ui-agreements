import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

@interactor class CoveredEresourcesListInteractor {
  clickAll = clickable('#clickable-pci-all');
  clickCurrent = clickable('#clickable-pci-current');
  clickFuture = clickable('#clickable-pci-future');
  clickDropped = clickable('#clickable-pci-dropped');
}

export default @interactor class AgreementViewInteractor {
  isViewAgreement = isPresent('#pane-view-agreement');
  clickLinesAccordion = clickable('#accordion-toggle-button-lines');
  coveredEresourcesList = new CoveredEresourcesListInteractor();

  whenLoaded() {
    return this.when(() => this.isViewAgreement);
  }
}
