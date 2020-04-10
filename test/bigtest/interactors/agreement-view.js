import {
  clickable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import DuplicateModalInteractor from '@folio/stripes-erm-components/lib/DuplicateModal/tests/interactor';
import AgreementLinesInteractor from './agreement-lines';

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
  duplicateAgreementModal = new DuplicateModalInteractor();
  expandAll = clickable('#clickable-expand-all');

  linesSection = new AgreementLinesInteractor('#lines');

  whenLoaded() {
    return this.when(() => this.isViewAgreement).timeout(5000);
  }
}
