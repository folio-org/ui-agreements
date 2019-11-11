import {
  clickable,
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class CheckboxInteractor {
  click = clickable();
}

export default @interactor class DuplicateAgreementModalInteractor {
  isDuplicateModalPresent = isPresent('#duplicate-agreement');
  checkBoxList = collection('input[type="checkbox"]', CheckboxInteractor);
  clickSaveAndClose = clickable('#duplicate-agreement-modal-save-button');
  clickClose = clickable('#duplicate-agreement-close-button');
  clickCancelButton = clickable('#duplicate-agreement-modal-cancel-button');
}
