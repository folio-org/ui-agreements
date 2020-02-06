import {
  clickable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import AgreementLinesInteractor from './agreement-lines';
import DuplicateAgreementModalInteractor from './duplicate-agreement-modal';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  isDuplicateButtonPresent = isPresent('#clickable-dropdown-duplicate-agreement')
  clickDuplicate = clickable('#clickable-dropdown-duplicate-agreement');
}

export default @interactor class AgreementViewInteractor {
  isViewAgreement = isPresent('#pane-view-agreement');
  lines = new AgreementLinesInteractor();
  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  headerDropdownMenu = new HeaderDropdownMenu();
  duplicateAgreementModal = new DuplicateAgreementModalInteractor();
  expandAll = clickable('#clickable-expand-all');

  linesSection = new AgreementLinesInteractor('#lines');

  whenLoaded() {
    return this.when(() => this.isViewAgreement).timeout(5000);
  }
}
