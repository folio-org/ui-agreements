import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class AgreementViewInteractor {
  isViewAgreement = isPresent('#pane-view-agreement');
  clickLinesAccordion = clickable('#accordion-toggle-button-lines');

  whenLoaded() {
    return this.when(() => this.isViewAgreement);
  }
}
