import {
  interactor,
  isPresent,
  clickable,
  fillable,
  selectable,
  value,
} from '@bigtest/interactor';

export default @interactor class AgreementFormInteractor {
  isAgreementForm = isPresent('#pane-agreement-form');
  fillName = fillable('#edit-agreement-name');
  name = value('#edit-agreement-name');
  selectStatus = selectable('#edit-agreement-status');
  fillStartDate = fillable('#period-start-date-0');
  createAgreement = clickable('#clickable-create-agreement');

  whenLoaded() {
    return this.when(() => this.isAgreementForm).timeout(5000);
  }
}
