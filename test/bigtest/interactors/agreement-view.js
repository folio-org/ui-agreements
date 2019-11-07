import {
  interactor,
  clickable,
  isPresent,
} from '@bigtest/interactor';

import AgreementLinesInteractor from './agreement-lines';

export default @interactor class AgreementViewInteractor {
  isViewAgreement = isPresent('#pane-view-agreement');
  expandAll = clickable('#clickable-expand-all');

  linesSection = new AgreementLinesInteractor('#lines');

  whenLoaded() {
    return this.when(() => this.isViewAgreement).timeout(5000);
  }
}
