import {
  interactor,
  clickable,
  fillable,
  selectable,
} from '@bigtest/interactor';

export default @interactor class AgreementFormInteractor {
  fillName = fillable('#edit-agreement-name');
  selectStatus = selectable('#edit-agreement-status');

  processDate = fillable('#period-start-date-0');
  createAgreement = clickable('#clickable-create-agreement');
}
