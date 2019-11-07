import {
  interactor,
  isPresent,
  collection,
  clickable,
  fillable,
  selectable,
  text,
  value,
} from '@bigtest/interactor';

@interactor class InternalContactCardInteractor {
  userName = text('[data-test-user-name]');
}

export default @interactor class AgreementFormInteractor {
  isAgreementForm = isPresent('#pane-agreement-form');
  fillName = fillable('#edit-agreement-name');
  name = value('#edit-agreement-name');
  selectStatus = selectable('#edit-agreement-status');
  fillStartDate = fillable('#period-start-date-0');
  createAgreement = clickable('#clickable-create-agreement');
  clickCancel = clickable('#clickable-cancel');
  clickCloseWithoutSave = clickable('[data-test-confirmation-modal-cancel-button]');
  clickSaveAndClose = clickable('#clickable-update-agreement');

  isInternalContactPresent = isPresent('[data-test-internal-contact]');
  internalContacts = collection('[data-test-internal-contact]', InternalContactCardInteractor)

  whenLoaded() {
    return this.when(() => this.isAgreementForm).timeout(5000);
  }
}
