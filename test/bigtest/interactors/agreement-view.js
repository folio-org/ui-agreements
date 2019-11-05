import {
  clickable,
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import AgreementLinesInteractor from './agreement-lines';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class CheckboxInteractor {
  click = clickable('input[type="checkbox"]');
}

@interactor class DuplicateAgreementModalInteractor {
  isDuplcateModalPresent = isPresent('#duplicate-agreement');
  checkBoxList = collection('#duplicate-agreement-content', CheckboxInteractor);
  clickSaveAndClose = clickable('#duplicate-agreement-modal-save-button');
}

@interactor class HeaderDropdownMenu {
  isDuplicateButtonPresent = isPresent('#clickable-dropdownduplicate-agreement')
  clickDuplicate = clickable('#clickable-dropdownduplicate-agreement');
}

export default @interactor class AgreementViewInteractor {
  isViewAgreement = isPresent('#pane-view-agreement');
  lines = new AgreementLinesInteractor();
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  duplicateAgreementModal = new DuplicateAgreementModalInteractor();

  whenLoaded() {
    return this.when(() => this.isViewAgreement).timeout(5000);
  }
}
